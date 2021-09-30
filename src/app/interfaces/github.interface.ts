export interface IGetReposSearchParams {
  q: string,
  sort?: string | 'stars' | 'forks' | 'help-wanted-issues' | 'updated',
  order?: string | 'desc' | 'asc',
  page?: number,
  per_page?: number
}

export interface IGetReposResponse {
  total_count?: number
  incomplete_results?: boolean
  items?: IReposItem[]
}

export interface IReposItem {
  id?: number
  node_id?: string
  name?: string
  full_name?: string
  private?: boolean,
  owner?: IReposItemOwner,
  html_url?: string
  description?: string
  fork?: boolean,
  url?: string
  forks_url?: string
  keys_url?: string
  collaborators_url?: string
  teams_url?: string
  hooks_url?: string
  issue_events_url?: string
  events_url?: string
  assignees_url?: string
  branches_url?: string
  tags_url?: string
  blobs_url?: string
  git_tags_url?: string
  git_refs_url?: string
  trees_url?: string
  statuses_url?: string
  languages_url?: string
  stargazers_url?: string
  contributors_url?: string
  subscribers_url?: string
  subscription_url?: string
  commits_url?: string
  git_commits_url?: string
  comments_url?: string
  issue_comment_url?: string
  contents_url?: string
  compare_url?: string
  merges_url?: string
  archive_url?: string
  downloads_url?: string
  issues_url?: string
  pulls_url?: string
  milestones_url?: string
  notifications_url?: string
  labels_url?: string
  releases_url?: string
  deployments_url?: string
  created_at?: string
  updated_at?: string
  pushed_at?: string
  git_url?: string
  ssh_url?: string
  clone_url?: string
  svn_url?: string
  homepage?: string
  size?: number
  stargazers_count?: number
  watchers_count?: number
  language?: string | null
  has_issues?: boolean
  has_projects?: boolean
  has_downloads?: boolean
  has_wiki?: boolean
  has_pages?: boolean
  forks_count?: number
  mirror_url?: boolean
  archived?: boolean
  disabled?: boolean
  open_issues_count?: number
  license?: IReposItemLic,
  allow_forking?: boolean,
  forks?: number
  open_issues?: number
  watchers?: number
  default_branch?: string
  score?: number
  subscribers_count?: number
  network_count?: number
}

export interface IReposItemOwner {
  login?: string
  id?: number
  node_id?: string
  avatar_url?: string
  gravatar_id?: string
  url?: string
  html_url?: string
  followers_url?: string
  following_url?: string
  gists_url?: string
  starred_url?: string
  subscriptions_url?: string
  organizations_url?: string
  repos_url?: string
  events_url?: string
  received_events_url?: string
  type?: string
  site_admin?: boolean
}

export interface IReposItemLic {
  key?: string
  name?: string
  spdx_id?: string
  url?: string
  node_id?: string,
  html_url?: string
}

export interface IReposItemOrg {
  login?: string
  id?: number
  node_id?: string
  avatar_url?: string
  gravatar_id?: string
  url?: string
  html_url?: string
  followers_url?: string
  following_url?: string
  gists_url?: string
  starred_url?: string
  subscriptions_url?: string
  organizations_url?: string
  repos_url?: string
  events_url?: string
  received_events_url?: string
  type?: string
  site_admin?: boolean
}

export interface IReposItemPermissions {
  pull?: boolean
  push?: boolean
  admin?: boolean
}

export interface IGetRepoParams {
  owner: string,
  repo: string
}

export interface IGetRepoResponse {
  id?: number
  node_id?: string
  name?: string
  full_name?: string
  owner?: IReposItemOwner
  private?: boolean
  html_url?: string
  description?: string,
  fork?: boolean
  url?: string
  archive_url?: string
  assignees_url?: string
  blobs_url?: string
  branches_url?: string
  collaborators_url?: string
  comments_url?: string
  commits_url?: string
  compare_url?: string
  contents_url?: string
  contributors_url?: string
  deployments_url?: string
  downloads_url?: string
  events_url?: string
  forks_url?: string
  git_commits_url?: string
  git_refs_url?: string
  git_tags_url?: string
  git_url?: string
  issue_comment_url?: string
  issue_events_url?: string
  issues_url?: string
  keys_url?: string
  labels_url?: string
  languages_url?: string
  merges_url?: string
  milestones_url?: string
  notifications_url?: string
  pulls_url?: string
  releases_url?: string
  ssh_url?: string
  stargazers_url?: string
  statuses_url?: string
  subscribers_url?: string
  subscription_url?: string
  tags_url?: string
  teams_url?: string
  trees_url?: string
  clone_url?: string
  mirror_url?: string
  hooks_url?: string
  svn_url?: string
  homepage?: string
  language?: string | null,
  forks_count?: number
  forks?: number
  stargazers_count?: number
  watchers_count?: number
  watchers?: number
  size?: number
  default_branch?: string
  open_issues_count?: number
  open_issues?: number
  is_template?: boolean
  topics?: string[]
  has_issues?: boolean
  has_projects?: boolean
  has_wiki?: boolean
  has_pages?: boolean
  has_downloads?: boolean
  archived?: boolean
  disabled?: boolean
  visibility?: string
  pushed_at?: string
  created_at?: string
  updated_at?: string
  permissions?: IReposItemPermissions
  allow_rebase_merge?: boolean
  template_repository?: IGetRepoResponse
  temp_clone_token?: string
  allow_squash_merge?: boolean
  allow_auto_merge?: boolean
  delete_branch_on_merge?: boolean
  allow_merge_commit?: boolean
  subscribers_count?: number
  network_count?: number
  license?: IReposItemLic
  organization?: IReposItemOrg,
  parent?: IGetRepoResponse
  source?: IGetRepoResponse
}

export interface IRepoPullsLabel {
  name: string
  color: string
}

export interface IRepoPullsUser {
  login: string
  avatar_url: string
  html_url: string
}

export interface IGetRepoPullsResponse {
  html_url: string
  number: number
  state: string
  title: string
  user: IRepoPullsUser
  created_at: string
  updated_at: string
  labels: IRepoPullsLabel[]
}

