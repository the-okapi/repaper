<script lang="ts">
	import { Button } from 'bits-ui';

	let { active, children, ...props } = $props();
</script>

<Button.Root {...props} data-state={active ? 'active' : 'inactive'} data-toggle-root>
	{@render children?.()}
</Button.Root>
