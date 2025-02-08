<template>
    <div class="container-fluid bg-secondary-subtle full-screen-container">
        <div class="row">
            <div class="col">
                <nav class="navbar navbar-expand-lg bg-body-tertiary">
                    <div class="container-fluid">
                        <button class="navbar-toggler" type="button" data-bs-toggle="collapse"
                            data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent"
                            aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>
                        <div class="collapse navbar-collapse" id="navbarSupportedContent">
                            <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                                <li class="nav-item list-group-item">
                                    <router-link to="/inicio" class="d-flex align-items-center p-3">
                                        <i class="fas fa-home"></i>
                                        <span class="ms-3 d-none d-sm-flex">Inicio</span>
                                    </router-link>
                                </li>
                                <li class="nav-item list-group-item">
                                    <router-link to="/compra" class="d-flex align-items-center p-3">
                                        <i class="fas fa-shopping-cart"></i>
                                        <span class="ms-3 d-none d-sm-flex">Compra/Venta</span>
                                    </router-link>
                                </li>
                                <li class="nav-item list-group-item">
                                    <router-link to="/analisis" class="d-flex align-items-center p-3">
                                        <i class="fas fa-exchange-alt"></i>
                                        <span class="ms-3 d-none d-sm-flex">Analisis</span>
                                    </router-link>
                                </li>
                                <li class="nav-item list-group-item">
                                    <router-link to="/historial" class="d-flex align-items-center p-3">
                                        <i class="fas fa-history"></i>
                                        <span class="ms-3 d-none d-sm-flex">Historial</span>
                                    </router-link>
                                </li>
                            </ul>
                            <button type="button" class="d-flex btn btn-outline-danger" @click="logout">Cerrar sesión</button>
                        </div>
                    </div>
                </nav>
            </div>
        </div>
        <div class="row flex-grow-1">
            <div class= "ps-5 pe-5 pt-4">
                <h2 class="pt-2 pb-2 bg-secondary text-dark">Análisis de Inversiones</h2>
            </div>
            
        <table class="table table-bordered table-hover mt-3">
            <thead class="table-dark">
                <tr>
                    <th>Criptomoneda</th>
                    <th>Resultado (ARS)</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(resultado, crypto) in analisis" :key="crypto">
                    <td>{{ crypto.toUpperCase() }}</td>
                    <td :class="{'text-success': resultado >= 0, 'text-danger': resultado < 0}">
                        {{ resultado.toFixed(2) }}
                    </td>
                </tr>
            </tbody>
        </table>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
import apiClient from '@/services/apiClient';

export default {
    data() {
        return {
            transacciones: [],
            preciosActuales: {},
            analisis: {}
        };
    },
    computed: {
        currentUser() {
            return this.$store.getters.currentUser;
        }
    },
    async mounted() {
        await this.obtenerTransacciones();
        await this.obtenerPrecios();
        this.calcularResultados();
    },
    methods: {
        async obtenerTransacciones() {
            try {
                const response = await apiClient.get(`/transactions?q={"user_id": "${this.currentUser.id}"}`);
                this.transacciones = response.data;
            } catch (error) {
                console.error("Error al obtener transacciones", error);
            }
        },
        async obtenerPrecios() {
            try {
                const cryptos = [...new Set(this.transacciones.map(tx => tx.crypto_code))];
                for (const crypto of cryptos) {
                    const response = await axios.get(`https://api.coingecko.com/api/v3/simple/price?ids=${crypto}&vs_currencies=ars`);
                    this.preciosActuales[crypto] = response.data[crypto].ars;
                }
            } catch (error) {
                console.error("Error al obtener precios de criptomonedas", error);
            }
        },
        calcularResultados() {
            const inversiones = {};
            this.transacciones.forEach(tx => {
                if (!inversiones[tx.crypto_code]) {
                    inversiones[tx.crypto_code] = { comprados: 0, invertido: 0, vendido: 0 };
                }
                if (tx.action === "purchase") {
                    inversiones[tx.crypto_code].comprados += parseFloat(tx.crypto_amount);
                    inversiones[tx.crypto_code].invertido += parseFloat(tx.money);
                } else if (tx.action === "sale") {
                    inversiones[tx.crypto_code].vendido += parseFloat(tx.money);
                }
            });

            Object.keys(inversiones).forEach(crypto => {
                const { comprados, invertido, vendido } = inversiones[crypto];
                const precioActual = this.preciosActuales[crypto] || 0;
                const valorActual = comprados * precioActual;
                this.analisis[crypto] = (valorActual + vendido) - invertido;
            });
        }
    }
};
</script>

<style scoped>
.text-success {
    color: green;
}
.text-danger {
    color: red;
}
</style>
