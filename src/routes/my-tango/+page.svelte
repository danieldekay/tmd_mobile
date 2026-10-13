<script lang="ts">
  import { onMount } from 'svelte';
  import { resolve } from '$app/paths';
  import { initAuth, isAuthenticated } from '$lib/auth';
  import { getFollowingEvents, getUserInteractions, removeUserInteraction } from '$lib/api/personalization';
  import type { FollowingEvent, UserInteraction } from '$lib/api/personalization';

  let loggedIn = $state(false);
  let loading = $state(true);
  let updating = $state<number | null>(null);
  let error = $state<string | null>(null);
  let followed = $state<UserInteraction[]>([]);
  let bookmarks = $state<UserInteraction[]>([]);
  let upcoming = $state<FollowingEvent[]>([]);

  const personTypes: Record<string, string> = {
    tmd_dj: 'DJ', tmd_teacher: 'Teacher',
    tmd_teacher_couple: 'Teaching couple',
    tmd_event_series: 'Event series'
  };

  let names = $derived(
    Object.fromEntries(
      upcoming.flatMap((event) => event.matchedBy.map((match) =>
        [`${match.target_post_type}:${match.target_post_id}`, match.title] as const
      ))
    )
  );

  async function refresh(): Promise<void> {
    loading = true;
    error = null;
    try {
      [followed, bookmarks] = await Promise.all([
        getUserInteractions('follow'),
        getUserInteractions('bookmark')
      ]);
      upcoming = (await getFollowingEvents(1, {}, 50)).events;
    } catch (cause) {
      error = cause instanceof Error ? cause.message : 'Could not load account interests.';
    } finally {
      loading = false;
    }
  }

  onMount(async () => {
    await initAuth();
    loggedIn = isAuthenticated();
    if (loggedIn) await refresh();
    else loading = false;
  });

  async function unfollow(interaction: UserInteraction): Promise<void> {
    if (updating !== null) return;
    updating = interaction.id;
    error = null;
    try {
      await removeUserInteraction(interaction.id);
      await refresh();
    } catch (cause) {
      error = cause instanceof Error ? cause.message : 'Could not update your follows.';
    } finally {
      updating = null;
    }
  }

  function itemLabel(interaction: UserInteraction): string {
    return names[`${interaction.target_post_type}:${interaction.target_post_id}`]
      || `${personTypes[interaction.target_post_type] ?? 'Profile'} #${interaction.target_post_id}`;
  }
</script>

<svelte:head>
  <title>My Tango - TMD Mobile</title>
</svelte:head>

<section class="space-y-5">
  <header>
    <h1 class="font-display text-4xl font-bold">My Tango</h1>
    <p class="mt-1 text-muted">Your saved events, followed people and upcoming appearances.</p>
  </header>

  {#if !loading && !loggedIn}
    <div class="panel p-5">
      <p class="font-semibold">Log in to synchronize your follows and saves.</p>
      <p class="mt-1 text-sm text-muted">Event discovery remains available without an account.</p>
      <a class="button-primary mt-4 inline-flex text-sm" href={resolve('/login')}>Log in</a>
    </div>
  {:else if loading}
    <div class="panel animate-pulse p-5" aria-busy="true">Loading your interests…</div>
  {:else}
    {#if error}
      <div class="panel border-accent p-4 text-sm" role="alert">
        {error}
        <button type="button" class="button-secondary mt-2 block" onclick={() => void refresh()}>Try again</button>
      </div>
    {/if}

    <div class="grid grid-cols-2 gap-3">
      <a class="panel p-4" href={resolve('/saved')}>
        <p class="eyebrow">Saved events and series</p>
        <p class="mt-1 font-display text-3xl font-bold">{bookmarks.length}</p>
        <p class="mt-1 text-sm text-muted">View your saved events</p>
      </a>
      <a class="panel p-4" href={resolve('/events?following=1')}>
        <p class="eyebrow">Following</p>
        <p class="mt-1 font-display text-3xl font-bold">{followed.length}</p>
        <p class="mt-1 text-sm text-muted">Explore their appearances</p>
      </a>
    </div>

    <section class="space-y-2">
      <h2 class="font-display text-2xl font-bold">People and series you follow</h2>
      {#if followed.length === 0}
        <p class="panel p-4 text-sm text-muted">You are not following any DJs, teachers, couples or series yet.</p>
      {:else}
        <ul class="space-y-2" aria-label="Followed people and event series">
          {#each followed as interaction (interaction.id)}
            <li class="panel flex items-center justify-between gap-3 p-3">
              <div class="min-w-0">
                <p class="truncate font-semibold">{itemLabel(interaction)}</p>
                <p class="text-xs text-muted">{personTypes[interaction.target_post_type] ?? 'Profile'}</p>
              </div>
              <button class="button-secondary shrink-0 text-sm" type="button"
                disabled={updating !== null}
                aria-label="Unfollow {itemLabel(interaction)}"
                onclick={() => void unfollow(interaction)}>
                {updating === interaction.id ? 'Updating…' : 'Unfollow'}
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </section>

    <section class="space-y-2">
      <div class="flex items-center justify-between gap-2">
        <h2 class="font-display text-2xl font-bold">Upcoming appearances</h2>
        <a class="text-sm font-semibold text-primary" href={resolve('/events?following=1')}>All matches</a>
      </div>
      {#if upcoming.length === 0}
        <div class="panel p-4 text-sm text-muted">No upcoming events match your follows.</div>
      {:else}
        <ul class="space-y-2">
          {#each upcoming.slice(0, 8) as event (event.id)}
            <li>
              <a href={resolve(`/events/${event.id}`)} class="panel block p-4 hover:bg-soft">
                <p class="font-semibold">{event.title}</p>
                <p class="mt-1 text-sm text-muted">{[event.city, event.country].filter(Boolean).join(', ')} · {event.dateStart ?? 'Date pending'}</p>
                <p class="mt-1 text-xs text-muted">
                  Featuring {event.matchedBy.map((match) => match.title).filter(Boolean).join(', ')}
                </p>
              </a>
            </li>
          {/each}
        </ul>
      {/if}
    </section>
  {/if}
</section>
