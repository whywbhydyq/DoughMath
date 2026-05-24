const commitSha=process.env.VERCEL_GIT_COMMIT_SHA;
const branch=process.env.VERCEL_GIT_COMMIT_REF;
const owner=process.env.VERCEL_GIT_REPO_OWNER;
const repo=process.env.VERCEL_GIT_REPO_SLUG;
if(!commitSha||!branch||!owner||!repo){console.log('Missing Vercel Git metadata. Proceeding with build.');process.exit(1);}
const url=`https://api.github.com/repos/${owner}/${repo}/commits/${encodeURIComponent(branch)}`;
try{const response=await fetch(url,{headers:{'User-Agent':'doughmath-vercel-build-filter',Accept:'application/vnd.github+json'}});if(!response.ok){console.log(`Could not verify latest commit (${response.status}). Proceeding with build.`);process.exit(1);}const latest=await response.json();if(latest?.sha&&latest.sha!==commitSha){console.log(`Skipping old Vercel build. Current=${commitSha}; latest=${latest.sha}; branch=${branch}`);process.exit(0);}console.log('Commit is latest for this branch. Proceeding with build.');process.exit(1);}catch(error){console.log('Could not verify latest commit. Proceeding with build.',error);process.exit(1);}
