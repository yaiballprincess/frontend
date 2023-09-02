<script lang="ts">
	export let value: Date | undefined;
	const padNumber = (n) => n.toString().padStart(2, '0');

	const formatToDateTimeLocal = (d) => {
		return d !== undefined
			? `${d.getFullYear()}-${padNumber(d.getMonth() + 1)}-${padNumber(d.getDate())}T${padNumber(
					d.getHours()
			  )}:${padNumber(d.getMinutes())}`
			: undefined;
	};
	const onChange = () => {
		value = dateTimeLocalString ? new Date(dateTimeLocalString) : undefined;
	};
	let dateTimeLocalString = formatToDateTimeLocal(value);
	$: dateTimeLocalString = formatToDateTimeLocal(value);
</script>

<input
	type="datetime-local"
	bind:value={dateTimeLocalString}
	on:input={onChange}
	{...$$restProps}
/>
