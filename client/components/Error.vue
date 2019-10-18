<template>
	<div v-if="error" class="mt-4">
		<b-alert show dismissible variant="danger">
			<h4>Error</h4>
			<p>{{ error }}</p>
		</b-alert>
	</div>
</template>

<script>
export default {
	name: 'Error',
	props: ['error']
}
</script>

<style>

</style>