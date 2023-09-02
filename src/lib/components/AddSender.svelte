<script lang="ts">
    import { addSender, refreshSenders } from '$lib/sender';
    let error;
    async function submit(ev) {
        const formData = new FormData(ev.target);
        console.log(formData);
        const userToken = formData.get("userToken");
        const botToken = (() => {
            const botTokenRaw = formData.get("botToken");
            return botTokenRaw.trim() ? botTokenRaw : undefined;
        })();
        const maybeError = await addSender(userToken, botToken);
        if (maybeError) {
            error = maybeError.message;
        } else {
            ev.target.reset();
            await refreshSenders();
        }

    }
</script>

<article>
    <form method="POST" on:submit|preventDefault={submit}>
        <input name="userToken" placeholder="User token" required minlength="10" type="password" />
        <input name="botToken" placeholder="Bot token (opt)" type="password" />
        <input type="submit" value="Add" />
    </form>
    {#if error}
        <div class="kb-error">{error}</div>
    {/if}
</article>

<style>
    .kb-error {
        color: red;
    }
</style>        