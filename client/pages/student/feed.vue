<template>
	<div>
		<h1>Feed</h1>
		<hr>
		<div v-if="loading" class="text-center">
			<b-spinner style="width: 3rem; height: 3rem;" variant="primary" label="Spinning"></b-spinner>
		</div>
		<div v-if="show">
			<h4>Tasks</h4>
			<FeedList :feeds="tasks" class="mt-4" />
			<hr>
			<h4>Programme</h4>
			<FeedList :feeds="programme" class="mt-4" />
			<hr>
			<h4>Details</h4>
			<p class="mt-4">Date: <strong>{{ details.date || 'unknown' }}</strong></p>
			<p>Location: <strong>{{ details.location || 'unknown' }}</strong></p>
		</div>
		<Error :error="error" />
	</div>
</template>

<script>
import { parse } from 'yaml';
import Error from '~/components/Error';
import FeedList from '~/components/FeedList';

export default {
	components: {
		Error,
		FeedList
	},
	data() {
		return {
			show: false,
			loading: false,
			error: null,
			tasks: [],
			programme: [],
			details: null
		}
	},
	methods: {
		async onLoad() {
			try {
				this.loading = true;
				const { tasks, programme, details } =
					parse((await this.$axios.get(`/student/feed.yml?auth=${this.$route.query.auth}`)).data);

				this.tasks = tasks;
				this.programme = programme;
				this.details = details;
				this.loading = false;
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