<template>
	<div>
		<h1>Overview</h1>
		<div v-if="loading" class="text-center">
			<b-spinner style="width: 3rem; height: 3rem;" variant="primary" label="Spinning"></b-spinner>
		</div>
		<div v-if="show" class="mt-4">
			<hr>
			<h4 class="mt-4">Table of Contents</h4>
			<ol>
				<li><a href="#entries">Entries</a></li>
				<li><a href="#summary">Summary</a></li>
				<li><a href="#storage">Storage</a></li>
			</ol>
			<hr>
			<h4 id="entries">Entries</h4>
			<b-table striped bordered :items="users"></b-table>
			<hr>
			<h4 class="mt-4" id="summary">Summary</h4>
			Entries Count: <strong>{{ totalEntries }}</strong>
			<b-badge variant="warning" v-if="duplicate">Duplicate Detected</b-badge>
			<br>
			Users Count (by phone): <strong>{{ totalPhones }}</strong>
			<br>
			Photos Count: <strong>{{ totalPhotos }}</strong>
			<hr>
			<h4 class="mt-4" id="storage">Storage</h4>
			<div>
				Storage taken: <strong>{{ totalSize.toFixed(2) }} MB</strong><br>
				Total: <strong>512.00 MB</strong>
				<b-progress :max="512" height="2rem" class="mt-2">
					<b-progress-bar :value="totalSize" striped animated variant="dark">
					</b-progress-bar>
				</b-progress>
			</div>
			<hr>
			<p class="text-muted">
				Data fetched at {{ now }}<br>
				Loading time: {{ timeTook }} ms
			</p>
		</div>
		<Error :error="error"/>
	</div>
</template>

<script>
import * as moment from 'moment';
import Error from '~/components/Error';

export default {
	components: {
		Error
	},
	data() {
		return {
			show: false,
			users: [],
			totalSize: 0,
			totalPhotos: 0,
			totalEntries: 0,
			totalPhones: 0,
			timeTook: null,
			loading: false,
			duplicate: false,
			error: null,
			now: moment().format('ddd MMM YYYY - HH:mm')
		}
	},
	methods: {
		async onLoad() {
			try {
				const startTime = Date.now();
				const phones = [];
				this.loading = true;
				const { users, totalSize } =
					await this.$axios.$get(`/api/special/overview?auth=${this.$route.query.auth}`);

				users.forEach(user => {
					if (phones.includes(user.phone)) this.duplicate = true;
					else phones.push(user.phone.trim());
					delete user.id;
					delete user.ip;
					user.createdAt = moment(user.createdAt).format('ddd MMM YYYY - HH:mm');
					this.totalPhotos += user.photos;
					this.totalEntries++;
				});

				this.users = users;
				this.totalSize = totalSize / (1024 ** 2);
				this.totalPhones = phones.length;
				this.loading = false;
				this.timeTook = Date.now() - startTime;
				this.show = true;
			} catch (error) {
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