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
				<p>
					In Charge: 
					<strong v-if="typeof feed.charge === 'string'">{{ feed.charge }}</strong>
					<strong v-else-if="Array.isArray(feed.charge)">{{ feed.charge.join(', ') }}</strong>
					<strong v-else>not set</strong>
				</p>
				<p v-if="feed.participants">
					Participants: <strong>{{ feed.participants.join(', ') }}</strong>
				</p>
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