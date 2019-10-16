<template>
	<div class="mb-4">
		<b-button href="#end" class="mb-4" size="lg" variant="primary">Go down</b-button>
		<b-list-group v-if="show">
		<div v-for="log in logs" v-bind:key="logs.indexOf(log)">
			<Log :log="log"></Log>
		</div>
		</b-list-group>
		<a href="#" id="end"></a>
	</div>
</template>

<script>
import Log from '~/components/Log';

export default {
	components: {
		Log
	},
	data() {
		return {
			logs: [],
			show: false
		}
	},
	methods: {
		async onLoad() {
			const auth = this.$route.query.auth;
			const res = await this.$axios.$get(`/api/admin/logs${auth ? `?auth=${auth}` : '' } `);
			this.logs = res.logs;
			this.show = true;
		}
	},
	mounted() {
		this.onLoad();
	}
}
</script>

<style>

</style>