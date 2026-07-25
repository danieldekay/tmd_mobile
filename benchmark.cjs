const { performance } = require('perf_hooks');

const event = {
	dateStart: '2024-05-10T12:00:00Z',
	dateEnd: '2024-05-12T23:59:59Z'
};

// 1. Unoptimized approach (current state)
function formatDateRangeUnoptimized(e) {
	if (!e.dateStart) return 'Date to be announced';
	const fmt = (d) =>
		new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' }).format(
			new Date(d)
		);
	const start = fmt(e.dateStart);
	const end = e.dateEnd ? fmt(e.dateEnd) : '';
	return end && end !== start ? `${start} – ${end}` : start;
}

// 2. Optimized approach
const dateRangeFormatter = new Intl.DateTimeFormat('en', { day: 'numeric', month: 'short', year: 'numeric' });
function formatDateRangeOptimized(e) {
	if (!e.dateStart) return 'Date to be announced';
	const fmt = (d) => dateRangeFormatter.format(new Date(d));
	const start = fmt(e.dateStart);
	const end = e.dateEnd ? fmt(e.dateEnd) : '';
	return end && end !== start ? `${start} – ${end}` : start;
}

const ITERATIONS = 10000;

// Warm-up
for (let i = 0; i < 100; i++) {
    formatDateRangeUnoptimized(event);
    formatDateRangeOptimized(event);
}

const t0 = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
	formatDateRangeUnoptimized(event);
}
const t1 = performance.now();
const timeUnoptimized = t1 - t0;

const t2 = performance.now();
for (let i = 0; i < ITERATIONS; i++) {
	formatDateRangeOptimized(event);
}
const t3 = performance.now();
const timeOptimized = t3 - t2;

console.log(`Iterations: ${ITERATIONS}`);
console.log(`Unoptimized: ${timeUnoptimized.toFixed(2)} ms`);
console.log(`Optimized: ${timeOptimized.toFixed(2)} ms`);
console.log(`Improvement: ${((timeUnoptimized - timeOptimized) / timeUnoptimized * 100).toFixed(2)}% faster`);
console.log(`Speedup factor: ${(timeUnoptimized / timeOptimized).toFixed(2)}x`);
