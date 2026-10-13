<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { initAuth, isAuthenticated } from '$lib/auth';
  import {
    followProfile,
    getFollowInteraction,
    removeUserInteraction
  } from '$lib/api/personalization';
  import type { FollowMatch } from '$lib/api/personalization';

  type Props = {
    id: number;
    targetType: FollowMatch['target_post_type'];
    name: string;
  };

  let { id, targetType, name }: Props = $props();
  let loggedIn = $state(false);
  let activeId = $state<number | null>(null);
  let loading = $state(true);
  let busy = $state(false);
  let errorMessage = $state<string | null>(null);

  onMount(async () => {
    await initAuth();
    loggedIn = isAuthenticated();
    if (!loggedIn) {
      loading = false;
      return;
    }
    try {
      activeId = (await getFollowInteraction(targetType, id))?.id ?? null;
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Could not check follow status.';
    } finally {
      loading = false;
    }
  });

  async function toggle(): Promise<void> {
    if (!loggedIn) {
      await goto('/login');
      return;
    }
    if (busy || loading) return;
    busy = true;
    errorMessage = null;
    try {
      if (activeId !== null) {
        await removeUserInteraction(activeId);
        activeId = null;
      } else {
        activeId = (await followProfile(targetType, id)).id;
      }
    } catch (error) {
      errorMessage = error instanceof Error ? error.message : 'Could not change follow status.';
    } finally {
      busy = false;
    }
  }
</script>

<div class="space-y-1">
  <button type="button"
    class="button-secondary text-sm"
    disabled={loading || busy}
    aria-pressed={loggedIn ? activeId !== null : undefined}
    aria-label={activeId !== null ? `Unfollow ${name}` : `Follow ${name}`}
    onclick={() => void toggle()}>
    {#if loading}
      Checking…
    {:else if busy}
      Updating…
    {:else if activeId !== null}
      Following · Unfollow
    {:else if loggedIn}
      Follow
    {:else}
      Log in to follow
    {/if}
  </button>
  {#if errorMessage}
    <p role="alert" class="text-xs text-accent">{errorMessage}</p>
  {/if}
</div>
