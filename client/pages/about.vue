<template>
	<div>
		<h2>About</h2>

		<hr>

		<h4>Table of Contents</h4>
		<ol>
			<li><a href="#introduction">Introduction</a></li>
			<li><a href="#authorization">Authorization</a></li>
			<li><a href="#how-to-submit-information">How to Submit Information</a></li>
			<li><a href="#special-access">Special Access</a></li>
		</ol>

		<hr>

		<h4 id="introduction">Introduction</h4>
		<p>
			Hello guys!<br>
			This website is for putting your information for various activities that you’d like to see in the graduation party’s. eg. presentation video and on the certificates.<br>
			You’re allowed to put a couple of pictures only in order for others to have their pics in the video too.<br>
			The website is simple, all you have to do is go to the <nuxt-link to="/auth">authorization page</nuxt-link>, input password, password type, and where to be redirected. More information about authorization is available below.<br>
			If anyone has any question they can ask me in the group.<br>
			See you at the party!
		</p>

		<hr>

		<h4 id="authorization">Authorization</h4>
		<p>
			This website uses authorization to protect from attacks, and avoid uninvited members.<br>
			There are four passwords that have different permissions.
		</p>
		<ul>
			<li>Student - Submitting information, viewing events and important notices.</li>
			<li>Special - Member has special access to utility pages. Such as viewing lists of data about students. Note, only members who participate in organising the event can have this password.</li>
			<li>Teacher - If it's not clear enough, this is for Mrs Mona. Provides more special access to pages.</li>
			<li>Admin - Member has access to everything.</li>
		</ul>

		<hr>

		<h4 id="how-to-submit-information">How to Submit Information</h4>
		<p>
			The student has to go through the authorization process.<br>
			First enter the password, then enter the respective password type (usually <italics>Student</italics>). Additionally, specify where to be redirected (<italics>Submit Info</italics> page)<br>
			Input your details accurately in the boxes, select max of 5 photos of yours and choose submit.<br>
			If there's an unexpected error or you are having difficulty, please tell me on the WhatsApp group.
		</p>

		<hr>

		<h4 id="special-access">Special Access</h4>
		<p>
			The reason I created this website is to have some form of secure medium to post our information for the graduation party activities, while providing utility operations for organisers. Hence why I'm restricting access to almost everything.<br>
			If you require special access to the data this website could gather about members, please contact me on the WhatsApp group.
		</p>
	</div>
</template>

<script>
export default {

}
</script>

<style>

</style>