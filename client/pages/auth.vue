<template>
	<div>
		<h2>Authorization</h2>
		<hr>
		<b-form @submit="onSubmit" v-if="show">
			<b-form-group
				id="input-group-pw"
				label="Password"
				label-for="input-pw"
			>
				<b-form-input
					id="input-pw"
					type="password"
					v-model="form.pw"
					:state="Boolean(form.pw)"
					required
					placeholder="Enter password"
				></b-form-input>
			</b-form-group>
			<b-form-group
				id="input-group-t"
				label="Authorization Type"
				label-for="input-t"
			>
				<b-form-select
					id="input-t"
					v-model="form.t"
					required
					:options="type"
				></b-form-select>
			</b-form-group>
			<b-form-group
				id="input-group-r"
				label="Redirect To"
				label-for="input-t"
			>
				<b-form-select
					id="input-r"
					v-model="form.r"
					required
					:options="redirect"
				></b-form-select>
			</b-form-group>
			<b-button type="submit" variant="success">Go</b-button>
		</b-form>
		<div v-if="error" class="mt-4">
			<b-card border-variant="danger" header="Error" align="center">
				<b-card-text>{{ error }}</b-card-text>
			</b-card>
		</div>
	</div>
</template>

<script>
export default {
	data() {
		const form = {
			pw: '',
			t: this.$route.query.t || null,
			r: null
		};

		return {
			show: true,
			form,
			type: [
				{ value: null, text: 'Select authorization type' },
				{ value: 0, text: 'Student' },
				{ value: 1, text: 'Special' },
				{ value: 2, text: 'Teacher' },
				{ value: 3, text: 'Admin' }
			],
			redirect: [
				{ value: null, text: 'Select redirect to' },
				{ value: '/submit-info', text: 'Submit info' },
				{ value: '/special/overview', text: 'Overview' },
				{ value: '/admin/logs', text: 'Server Logs' },
			],
			error: null
		}
	},
	methods: {
		async onSubmit(e) {
			try {
				e.preventDefault();
				this.error = null;
				const { token } = await this.$axios.$get(`/api/auth?pw=${this.form.pw}&t=${this.form.t}`);
				this.$router.push(`${this.form.r}?auth=${token}`);
			} catch (error) {
				console.log(error);
				this.error = 'Incorrect authorization details were provided.';
			}
		}
	}
}
</script>

<style>

</style>