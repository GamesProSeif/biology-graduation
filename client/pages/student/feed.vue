<template>
	<div>
		<h1>Feed</h1>
		<hr>
		<h3>Table of Contents</h3>
		<ol>
			<li><a href="#tasks">Tasks</a></li>
			<li><a href="#programme">Programme</a></li>
			<li><a href="#details">Details</a></li>
		</ol>
		<hr>
		<div v-if="loading" class="text-center">
			<b-spinner style="width: 3rem; height: 3rem;" variant="primary" label="Spinning"></b-spinner>
		</div>
		<div v-if="show">
			<h3 id="tasks">Tasks</h3>
			<FeedList :feeds="tasks" class="mt-4" />
			<hr>
			<h3 id="programme">Programme</h3>
			<FeedList :feeds="programme" class="mt-4" />
			<hr>
			<h3 id="details">Details</h3>
			<p class="mt-4">Date: <strong>{{ details.date || 'unknown' }}</strong></p>
			<p>
				Location: 
				<a target="_blank" :href="details.locationURL">{{ details.location || 'unknown' }}</a>
				</p>
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