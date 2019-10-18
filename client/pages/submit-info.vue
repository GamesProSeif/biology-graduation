<template>
	<div>
		<b-form @submit="onSubmit" @reset="onReset" v-if="show">
			<h1>Submit Information</h1>
			<hr>
			<b-alert show variant="warning" dismissible>
				<h4>Warning</h4>
				<p>If your device doesn't support selecting more than one photo at once, feel free to submit multiple times. Make sure you enter the same name and phone so photos get merged to your existing entry successfully.</p>
			</b-alert>
			<b-form-group
				id="input-group-name"
				description="Recommended: Enter first, second, third and last names for graduation certificates."
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
				id="input-group-phone"
				label="Phone"
				label-for="input-phone"
				description="Please input the number you use for WhatsApp."
			>
				<b-form-input
					id="input-phone"
					v-model="form.phone"
					:state="Boolean(form.phone)"
					required
					placeholder="Enter phone"
				></b-form-input>
			</b-form-group>

			<b-form-group
				id="input-group-photos"
				description="Max of 5 photos (jpg/png)."
				label="Photos"
				label-for="input-photos"
			>
				<b-form-file
					id="input-photos"
					class="overflow-hidden"
					accept=".jpg, .png"
					v-model="form.photos"
					:state="Boolean(form.photos.length && form.photos.length <= 5)"
					:file-name-formatter="formatNames"
					placeholder="Choose files or drop here..."
					drop-placeholder="Drop files here..."
					multiple
					required
				></b-form-file>
			</b-form-group>

			<b-button v-if="loading" variant="primary" disabled>
				<b-spinner small></b-spinner>
				Uploading...
			</b-button>
			<b-button v-else-if="!success" type="submit" variant="primary">Submit</b-button>
			<b-button type="reset" variant="danger">Reset</b-button>
		</b-form>
		<div v-if="success" class="mt-4">
			<b-alert show variant="success">
				<h4>Uploaded</h4>
				<p v-if="response.modified">Added photos to existing entry</p>
				<p v-else>Information uploaded and saved</p>
				<p>Total Photos: <strong>{{ response.user.photos }}</strong></p>
			</b-alert>
		</div>
		<Error :error="error"/>
	</div>
</template>

<script>
import Error from '~/components/Error';

export default {
	components: {
		Error
	},
	data() {
		return {
			form: {
				name: '',
				phone: '',
				photos: []
			},
			show: true,
			success: false,
			response: null,
			error: null,
			loading: false
		}
	},
	methods: {
		async onSubmit(e) {
			try {
				e.preventDefault();
				if (this.form.photos.length > 5) {
					this.form.photos = [];
					throw new Error('Max photos to upload is 5');
				}
				this.loading = true;
	
				const data = new FormData();
				data.append('name', this.form.name);
				data.append('phone', this.form.phone);
				this.form.photos.forEach(photo => {
					data.append(photo.name, photo);
				});

				const res = await this.$axios.$post(`/api/submit-info?auth=${this.$route.query.auth}`, data, {
					headers: {
						'Content-Type': `multipart/form-data; boundary=${data._boundary}`
					}
				});

				if (typeof res !== 'object' || !res.user) {
					throw new Error('Authorization session expired. Please re-authorize.');
				}
	
				this.loading = false;
				this.success = true;
				this.response = res;
			} catch (error) {
				this.loading = false;
				this.error = error;
			}
		},
		onReset(e) {
			e.preventDefault();
			this.form.name = '';
			this.form.phone = '';
			this.form.photos = [];

			this.show = false;
			this.loading = false;
			this.success = false;
			this.error = null;
			this.response = null;
			this.$nextTick(() => {
				this.show = true;
			});
		},
		formatNames(files) {
			return `${files.length} photos selected`;
		}
	}
}
</script>

<style>

</style>