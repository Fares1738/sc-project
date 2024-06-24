import snapshot from '@snapshot-labs/snapshot.js';

const hub = 'https://testnet.hub.snapshot.org'; // or https://hub.snapshot.org
export const client = new snapshot.Client712(hub);
export const appName = "PDVS"
export const spaceName = "persaka.eth"