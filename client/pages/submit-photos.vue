<template>
	<div>
		<b-form @submit="onSubmit" @reset="onReset" v-if="show">
			<b-form-group
				id="input-group-name"
				label="Name"
				label-for="input-name"
			>
				<b-form-input
					id="input-name"
					v-model="form.name"
					:state="Boolean(form.name)"
					required
					placeholder="Enter name"
				></b-form-input>
			</b-form-group>

			<b-form-group
				id="input-group-photos"
				label="Photos"
				label-for="input-photos"
			>
				<b-form-file
					id="input-photos"
					v-model="form.photos"
					:state="Boolean(form.photos.length)"
					placeholder="Choose files or drop here..."
					drop-placeholder="Drop files here..."
					multiple
					required
				></b-form-file>
				<p class="mt-3" v-if="form.photos.length">Selected items:</p>
				<b-list-group horizontal class="mt-3">
					<b-list-group-item v-for="photo in form.photos" v-bind:key="photo.name">
						{{ photo.name }}
					</b-list-group-item>
				</b-list-group>
			</b-form-group>

			<b-button type="submit" variant="primary">Submit</b-button>
			<b-button type="reset" variant="danger">Reset</b-button>
		</b-form>
	</div>
</template>

<script>
export default {
	data() {
		return {
			form: {
				name: '',
				photos: []
			},
			show: true
		}
	},
	methods: {
		async onSubmit(e) {
			e.preventDefault();

			const data = new FormData();
			data.append('name', this.form.name);
			this.form.photos.forEach(photo => {
				data.append(photo.name, photo);
			});
			
			const res = await this.$axios.$post('http://localhost:3000/api/submit-photos', data, {
				headers: {
					'Content-Type': `multipart/form-data; boundary=${data._boundary}`
				}
			});

			alert(JSON.stringify(res));
		},
		onReset(e) {
			e.preventDefault();
			this.form.name = '';
			this.form.photos = [];

			this.show = false;
			this.$nextTick(() => {
				this.show = true;
			});
		}
	}
}
</script>

<style>

</style>