<template>
    <div class="modal is-active">
        <div class="modal-background"></div>
        <div class="modal-content">
            <div class="box">
                <div><p>Are you sure you want to remove {{ resource.name }}?</p></div>
                <div class="field is-grouped">
                    <p class="control">
                        <button class="button" @click="$emit('close')">
                            No
                        </button>
                    </p>
                    <p class="control">
                        <button class="button is-warning" @click="$emit('confirm', resource.id)">
                            Yes
                        </button>
                    </p>
                </div>
            </div>
        </div>
        <button class="modal-close is-large" aria-label="close" @click="$emit('close')"></button>
    </div>
</template>

<script>
export default {
    props: ['resource'],

};
</script>
