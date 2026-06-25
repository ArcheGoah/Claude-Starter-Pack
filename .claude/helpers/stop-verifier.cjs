#!/usr/bin/env node
/**
 * Stop Hook: Checks for incomplete work markers before allowing stop.
 * Blocks stop if TODO, FIXME, stub, placeholder found in last message.
 */
let data = '';
process.stdin.setEncoding('utf8');
process.stdin.on('data', (c) => { data += c; });

setTimeout(() => {
  try {
    const input = JSON.parse(data);

    // Prevent infinite loop — if already triggered once, allow stop
    if (input.stop_hook_active) {
      console.log(JSON.stringify({ decision: 'allow' }));
      process.exit(0);
    }

    const msg = (input.last_assistant_message || '').toLowerCase();
    const incomplete = [
      'todo', 'fixme', 'will implement later', 'placeholder',
      'stub', 'coming soon', 'not yet implemented'
    ];

    const found = incomplete.filter(marker => msg.includes(marker));

    if (found.length > 0) {
      console.log(JSON.stringify({
        decision: 'block',
        reason: 'INCOMPLETE: Found unfinished markers: ' + found.join(', ') +
                '. Complete all tasks before stopping.'
      }));
    } else {
      console.log(JSON.stringify({ decision: 'allow' }));
    }
  } catch (e) {
    console.log(JSON.stringify({ decision: 'allow' }));
  }
  process.exit(0);
}, 400);

process.stdin.resume();
