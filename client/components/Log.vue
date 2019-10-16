<template>
	<div class="mb-2">
		<b-list-group-item class="overflow-auto">
			<h5>
				<b-badge pill variant="info" v-if="level === 'info'">INFO</b-badge>
				<b-badge pill variant="danger" v-else-if="level === 'error'">ERROR</b-badge>
				<b-badge pill variant="secondary" v-else-if="level === 'debug'">DEBUG</b-badge>
				<b-badge pill variant="warning" v-else-if="level === 'warn'">WARN</b-badge>
				<b-badge pill variant="dark" v-else-if="level === 'verbose'">VERBOSE</b-badge>
				<b-badge pill variant="primary" v-else>{{ level }}</b-badge>
				{{ timestamp }}
			</h5>
			<b-breadcrumb :items="items"></b-breadcrumb>
			<hr>
			<h6>{{ message }}</h6>
			<div v-if="rest.length > 0" >
				<hr>
				<p v-for="field in rest" v-bind:key="field[0]">
					{{ field[0] }}: {{ field[1] }}
				</p>
			</div>
			</b-list-group-item>
	</div>
</template>

<script>
export default {
	name: 'Log',
	props: ['log'],
	data() {
		const { label, topic, event, level, message, timestamp, ...rest } = this.log;
		const items = [];
		items.push({ text: label, active: true });
		items.push({ text: topic, active: true });
		if (event) items.push({ text: event, active: true });

		return { items, level, message, timestamp, rest: Object.entries(rest) };
	}
}
</script>

<style>

</style>