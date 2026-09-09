<script lang="ts">
	import { m } from '$lib/paraglide/messages';
	import { Label, Button } from 'bits-ui';
</script>

<div class="flex h-[calc(100vh-5rem)] w-screen items-center justify-center">
	<form method="POST" class="border-o relative h-fit w-fit rounded-2xl bg-(--bg) p-10">
		<h1 class="mb-6 text-3xl font-bold">{m.create_organization()}</h1>

		<div class="m-auto w-fit">
			<Label.Root for="name">{m.name()}:</Label.Root><br />
			<input name="name" class="w-70" type="text" id="name" />
		</div>

		<Button.Root type="submit" class="m-auto mt-5 block">{m.submit()}</Button.Root>
	</form>
</div>
