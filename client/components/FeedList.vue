<template>
	<div>
		<b-list-group>
			<b-list-group-item v-for="feed in feeds" :key="feeds.indexOf(feed)" class="mb-2">
				<h5>
					{{ feed.name }}
					<span>
						<b-badge v-if="feed.status === -1"  pill variant="danger">Did not start</b-badge>
						<b-badge v-else-if="feed.status === 0"  pill variant="warning">In progress</b-badge>
						<b-badge v-else-if="feed.status === 1"  pill variant="success">Done</b-badge>
					</span>
				</h5>
				<hr>
				<p>In Charge: <strong>{{ feed.charge || 'not set' }}</strong></p>
				<div v-if="feed.description">
					<hr>
					<p>{{ feed.description }}</p>
				</div>
			</b-list-group-item>
		</b-list-group>
	</div>
</template>

<script>
export default {
	name: 'FeedList',
	props: ['feeds']
}
</script>

<style>

</style>