<template>
    <div>
        <h2>About page</h2>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Vero iure, tenetur a eveniet, nostrum voluptas itaque unde aut, neque sed blanditiis quam ex optio assumenda. Unde nesciunt autem culpa harum?
        Veniam nam consequatur voluptatem libero eos dolorem perferendis sit laudantium temporibus ipsa dolores qui commodi dicta magnam ab doloremque debitis quo, vitae soluta vero consectetur aliquam! Sed at est natus.</p>
        <p>Lorem ipsum dolor sit, amet consectetur adipisicing elit. Voluptate cum assumenda nesciunt quaerat repudiandae quae nam magnam corrupti corporis. Cupiditate eligendi dolor quidem? Quasi eius iste vero officiis dolores? Eos.
        Alias omnis dolorem vitae consequuntur aliquid explicabo dicta quibusdam? Perferendis quod exercitationem minima, labore at, sed quo asperiores est consectetur ab quos natus! Placeat nam, ex dolorem labore aliquid et!
        Repellat, officia, velit voluptatum eveniet, magni dicta ea quis eligendi quisquam architecto atque! A delectus optio minus, iusto veniam possimus vel fugiat sit doloremque dignissimos odit blanditiis, ipsam laboriosam officia.
        Corporis aliquam illum laboriosam architecto, fugit vero sapiente doloribus perspiciatis amet quo libero voluptates eveniet enim delectus ex ea. Quibusdam, quis? Reprehenderit praesentium dolore velit, magni pariatur excepturi cumque illum.
        Distinctio vero animi commodi eos molestias earum quod enim nobis provident, corrupti repellendus fugit porro reprehenderit facere natus doloremque aut maxime et ab sunt voluptatibus eveniet. Eum perspiciatis facilis tempore!</p>
        <!-- <div>{{ data?.message }}</div> -->
        <div>{{ data }}</div>
    </div>
</template>

<script setup>
    // const {data} = await useFetch('/api/eduhub?name=mario',{
    //     method: 'post',
    //     body: {age: 30}
    // })
    const {data} = await useFetch('/api/eduhub')
</script>

<style scoped>
h2 {
    margin-bottom: 20px;
    font-size: 36px;
}
p{
    margin: 20px 0;
}

</style>