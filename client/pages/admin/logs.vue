<template>
	<div class="mb-4">
		<div v-if="show && !error">
			<div class="text-center">
				<b-button href="#end" class="mb-4" size="lg" variant="primary">Go down</b-button>
			</div>
			<b-list-group>
				<div v-for="log in logs" v-bind:key="logs.indexOf(log)">
					<Log :log="log"></Log>
				</div>
			</b-list-group>
			<a id="end"></a>
		</div>
		<div v-else-if="!error" class="text-center">
			<b-spinner style="width: 3rem; height: 3rem;" variant="primary" label="Spinning"></b-spinner>
		</div>
		<Error v-else :error="error"/>
	</div>
</template>

<script>
import Log from '~/components/Log';
import Error from '~/components/Error';

export default {
	components: {
		Log,
		Error
	},
	data() {
		return {
			logs: [],
			show: false,
			error: null
		}
	},
	methods: {
		async onLoad() {
			try {
				const auth = this.$route.query.auth;
				const res = await this.$axios.$get(`/api/admin/logs${auth ? `?auth=${auth}` : '' } `);
				this.logs = res.logs;
				this.show = true;
			} catch (error) {
				this.show = false;
				this.error = error;
			}
		}
	},
	mounted() {
		this.onLoad();
	}
}
</script>

<style>

</style>