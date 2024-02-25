<template>
    <div>
        <div class="grid grid-cols-4 gap-5">
            <div v-for="product in products" :key="product">
                <ProductCard :product="product"/>
            </div>
        </div>
    </div>
</template>

<script setup>
    definePageMeta({
        layout: 'products'
    });

    //fetch the products
    const {data: products} = await useFetch('https://fakestoreapi.com/products')

    useHead({
        title: 'Nuxt Hub | Product',
        meta: [
            {name: 'description', content: 'Nuxt hub products'}
        ]
    })
</script>

<style lang="scss" scoped>

</style>