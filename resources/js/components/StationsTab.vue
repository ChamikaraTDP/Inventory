<template>
    <div>
        <ol>
            <li v-for="station of details" :key="station.id">{{ station.name }}</li>
        </ol>
    </div>
</template>

<script>
export default {
    props: ['details'],
};
</script>
