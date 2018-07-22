const path = `${process.env.VUE_APP_HOST}/api/v1/v2ex`;

export default {
  path,
  hot: `${path}/hot`,
  new: `${path}/new`,
  allNodes: `${path}/all-nodes`,
  node: `${path}/node`,
  nodes: `${path}/nodes`,
  member: `${path}/member`,
  t: `${path}/t`,
};