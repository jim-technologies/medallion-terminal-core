import {
  useMemo,
  useState,
  type CSSProperties,
} from 'react'
import { CLONE_DEMO_IDENTITY } from '../../demoIdentity'
import {
  OperationalShowcaseIcon,
  type OperationalShowcaseIconName,
} from '../../shared/OperationalShowcasePrimitives'
import './MetaSocialShowcase.css'

export type MetaSocialProduct = 'instagram' | 'facebook' | 'threads'

export interface MetaSocialAuthor {
  id: string
  name: string
  handle: string
  subtitle?: string
  verified?: boolean
  color?: string
}

export interface MetaSocialPost {
  id: string
  author: MetaSocialAuthor
  body: string
  timestamp: string
  imageUrl?: string
  imageAlt?: string
  location?: string
  audience?: string
  likes: number
  comments: number
  shares: number
  liked?: boolean
  saved?: boolean
  following?: boolean
}

export interface MetaSocialStory {
  id: string
  author: MetaSocialAuthor
  title: string
  imageUrl: string
  seen?: boolean
}

export interface MetaSocialSuggestion {
  id: string
  author: MetaSocialAuthor
  reason: string
}

export interface MetaSocialShowcaseProps {
  product: MetaSocialProduct
  posts?: readonly MetaSocialPost[]
  stories?: readonly MetaSocialStory[]
  suggestions?: readonly MetaSocialSuggestion[]
  initialView?: string
  initialQuery?: string
  initialSelectedPostId?: string
  companyName?: string
  userName?: string
  onViewChange?: (view: string) => void
  onSelectPost?: (postId: string) => void
  onToggleLike?: (postId: string, liked: boolean) => void
  onToggleSave?: (postId: string, saved: boolean) => void
  onToggleFollow?: (authorId: string, following: boolean) => void
}

export const META_SOCIAL_VIEWS = {
  instagram: ['feed', 'explore', 'profile'],
  facebook: ['feed', 'groups', 'business-page'],
  threads: ['for-you', 'following', 'profile'],
} as const satisfies Record<MetaSocialProduct, readonly string[]>

const AUTHORS = {
  jun: author('jun', 'Jun', 'jun', 'Jim Technologies · Founder', '#315b7d', true),
  jim: author('jim-technologies', 'Jim Technologies', 'jimtech', 'Technology company', '#355c7d', true),
  maya: author('maya', 'Maya Chen', 'mayachen', 'Operations', '#8a5f75', true),
  lina: author('lina', 'Lina Torres', 'linatorres', 'Customer success', '#4f7b6d'),
  noah: author('noah', 'Noah Williams', 'noahbuilds', 'Product design', '#8c6d45'),
  amelia: author('amelia', 'Amelia Stone', 'ameliastone', 'Founder community', '#6f658c'),
} as const

function author(
  id: string,
  name: string,
  handle: string,
  subtitle: string,
  color: string,
  verified = false,
): MetaSocialAuthor {
  return { id, name, handle, subtitle, color, verified }
}

const scene = (name: 'coast' | 'ridge' | 'city' | 'forest' | 'studio' | 'harbor') =>
  `/examples/media-demo.svg#${name}`

export const META_SOCIAL_SAMPLE_POSTS: readonly MetaSocialPost[] = [
  {
    id: 'operating-system',
    author: AUTHORS.jim,
    body: 'A calmer operating system for growing teams: one view for customers, projects, data, and the decisions that move the business forward.',
    timestamp: '18m',
    imageUrl: scene('studio'),
    imageAlt: 'Abstract studio planning board',
    location: 'San Francisco, California',
    audience: 'Public',
    likes: 1842,
    comments: 96,
    shares: 214,
    liked: true,
    saved: true,
    following: true,
  },
  {
    id: 'coastal-review',
    author: AUTHORS.maya,
    body: 'A productive offsite, a sharper launch plan, and just enough ocean air. The customer commitments are mapped and ready for review.',
    timestamp: '42m',
    imageUrl: scene('coast'),
    imageAlt: 'Abstract golden coast',
    location: 'Half Moon Bay, California',
    audience: 'Public',
    likes: 728,
    comments: 31,
    shares: 18,
    following: true,
  },
  {
    id: 'build-notes',
    author: AUTHORS.noah,
    body: 'Build note: the best business software makes complex systems feel legible. Strong defaults first, escape hatches second.',
    timestamp: '1h',
    imageUrl: scene('ridge'),
    imageAlt: 'Abstract mountain ridge at sunset',
    audience: 'Public',
    likes: 534,
    comments: 48,
    shares: 72,
    following: true,
  },
  {
    id: 'customer-evening',
    author: AUTHORS.lina,
    body: 'Closed the week with three customer launches and a much shorter open-issues list. Proud of this team.',
    timestamp: '2h',
    imageUrl: scene('city'),
    imageAlt: 'Abstract city skyline at night',
    location: 'San Francisco, California',
    audience: 'Friends',
    likes: 391,
    comments: 24,
    shares: 9,
  },
  {
    id: 'founder-thread',
    author: AUTHORS.amelia,
    body: 'Three things I wish every owner dashboard answered immediately:\n1. What changed?\n2. What needs a decision?\n3. Who owns the next move?',
    timestamp: '3h',
    audience: 'Public',
    likes: 1104,
    comments: 143,
    shares: 287,
    following: true,
  },
  {
    id: 'quiet-progress',
    author: AUTHORS.jun,
    body: 'Quiet progress compounds. We finished the frontend readiness pass today: contracts, product surfaces, accessibility, and release gates are all green.',
    timestamp: '5h',
    imageUrl: scene('forest'),
    imageAlt: 'Abstract forest path',
    audience: 'Public',
    likes: 862,
    comments: 67,
    shares: 104,
    liked: true,
    following: true,
  },
]

export const META_SOCIAL_SAMPLE_STORIES: readonly MetaSocialStory[] = [
  story('your-story', AUTHORS.jun, 'Your story', 'studio'),
  story('jim-story', AUTHORS.jim, 'Jim Tech', 'city'),
  story('maya-story', AUTHORS.maya, 'Maya', 'coast'),
  story('lina-story', AUTHORS.lina, 'Lina', 'harbor'),
  story('noah-story', AUTHORS.noah, 'Noah', 'ridge', true),
  story('amelia-story', AUTHORS.amelia, 'Amelia', 'forest', true),
]

function story(
  id: string,
  storyAuthor: MetaSocialAuthor,
  title: string,
  image: 'coast' | 'ridge' | 'city' | 'forest' | 'studio' | 'harbor',
  seen = false,
): MetaSocialStory {
  return { id, author: storyAuthor, title, imageUrl: scene(image), seen }
}

export const META_SOCIAL_SAMPLE_SUGGESTIONS: readonly MetaSocialSuggestion[] = [
  { id: 'suggestion-maya', author: AUTHORS.maya, reason: 'Followed by Jim Technologies' },
  { id: 'suggestion-noah', author: AUTHORS.noah, reason: 'Popular with founders' },
  { id: 'suggestion-amelia', author: AUTHORS.amelia, reason: 'Suggested for you' },
  { id: 'suggestion-lina', author: AUTHORS.lina, reason: 'Works with Jun' },
]

export function resolveMetaSocialView(product: MetaSocialProduct, view?: string): string {
  const views = META_SOCIAL_VIEWS[product]
  return view && (views as readonly string[]).includes(view) ? view : views[0]
}

export function MetaSocialShowcase({
  product,
  posts = META_SOCIAL_SAMPLE_POSTS,
  stories = META_SOCIAL_SAMPLE_STORIES,
  suggestions = META_SOCIAL_SAMPLE_SUGGESTIONS,
  initialView,
  initialQuery = '',
  initialSelectedPostId,
  companyName = CLONE_DEMO_IDENTITY.company,
  userName = CLONE_DEMO_IDENTITY.user,
  onViewChange,
  onSelectPost,
  onToggleLike,
  onToggleSave,
  onToggleFollow,
}: MetaSocialShowcaseProps) {
  const [view, setViewState] = useState(() => resolveMetaSocialView(product, initialView))
  const [query, setQuery] = useState(initialQuery)
  const [selectedPostId, setSelectedPostId] = useState(initialSelectedPostId ?? '')
  const [likedIds, setLikedIds] = useState(
    () => new Set(posts.filter(post => post.liked).map(post => post.id)),
  )
  const [savedIds, setSavedIds] = useState(
    () => new Set(posts.filter(post => post.saved).map(post => post.id)),
  )
  const [followingIds, setFollowingIds] = useState(
    () => new Set(posts.filter(post => post.following).map(post => post.author.id)),
  )

  const visiblePosts = useMemo(() => {
    const normalized = query.trim().toLowerCase()
    const available = product === 'threads' && view === 'following'
      ? posts.filter(post => followingIds.has(post.author.id))
      : posts
    if (!normalized) return available
    return available.filter(post => [
      post.author.name,
      post.author.handle,
      post.body,
      post.location,
    ].filter(Boolean).join(' ').toLowerCase().includes(normalized))
  }, [followingIds, posts, product, query, view])

  const setView = (next: string) => {
    const resolved = resolveMetaSocialView(product, next)
    setViewState(resolved)
    onViewChange?.(resolved)
  }
  const selectPost = (postId: string) => {
    setSelectedPostId(postId)
    onSelectPost?.(postId)
  }
  const toggleLike = (postId: string) => {
    const liked = !likedIds.has(postId)
    setLikedIds(current => {
      const next = new Set(current)
      if (liked) next.add(postId)
      else next.delete(postId)
      return next
    })
    onToggleLike?.(postId, liked)
  }
  const toggleSave = (postId: string) => {
    const saved = !savedIds.has(postId)
    setSavedIds(current => {
      const next = new Set(current)
      if (saved) next.add(postId)
      else next.delete(postId)
      return next
    })
    onToggleSave?.(postId, saved)
  }
  const toggleFollow = (authorId: string) => {
    const following = !followingIds.has(authorId)
    setFollowingIds(current => {
      const next = new Set(current)
      if (following) next.add(authorId)
      else next.delete(authorId)
      return next
    })
    onToggleFollow?.(authorId, following)
  }
  const shared: ProductRendererProps = {
    view,
    setView,
    query,
    setQuery,
    visiblePosts,
    allPosts: posts,
    stories,
    suggestions,
    selectedPostId,
    likedIds,
    savedIds,
    followingIds,
    selectPost,
    toggleLike,
    toggleSave,
    toggleFollow,
    companyName,
    userName,
  }

  return (
    <div
      className={`meta-social-showcase meta-social-${product}`}
      data-product={`meta-${product}`}
      data-view={view}
    >
      {product === 'instagram' && <InstagramShowcase {...shared} />}
      {product === 'facebook' && <FacebookShowcase {...shared} />}
      {product === 'threads' && <ThreadsShowcase {...shared} />}
    </div>
  )
}

interface ProductRendererProps {
  view: string
  setView: (view: string) => void
  query: string
  setQuery: (query: string) => void
  visiblePosts: readonly MetaSocialPost[]
  allPosts: readonly MetaSocialPost[]
  stories: readonly MetaSocialStory[]
  suggestions: readonly MetaSocialSuggestion[]
  selectedPostId: string
  likedIds: ReadonlySet<string>
  savedIds: ReadonlySet<string>
  followingIds: ReadonlySet<string>
  selectPost: (postId: string) => void
  toggleLike: (postId: string) => void
  toggleSave: (postId: string) => void
  toggleFollow: (authorId: string) => void
  companyName: string
  userName: string
}

function InstagramShowcase(props: ProductRendererProps) {
  const { view, setView, query, setQuery, stories, suggestions, userName } = props
  return (
    <div className="meta-instagram-shell">
      <SocialRail
        product="instagram"
        userName={userName}
        items={[
          { view: 'feed', label: 'Home', icon: 'home' },
          { view: 'explore', label: 'Search', icon: 'search' },
          { view: 'explore', label: 'Explore', icon: 'apps' },
          { view: 'feed', label: 'Reels', icon: 'play' },
          { view: 'feed', label: 'Messages', icon: 'message' },
          { view: 'feed', label: 'Notifications', icon: 'heart' },
          { view: 'feed', label: 'Create', icon: 'plus' },
          { view: 'profile', label: 'Profile', icon: 'user' },
        ]}
        activeView={view}
        setView={setView}
      />
      <main className="meta-instagram-main">
        {view === 'feed' && (
          <div className="meta-instagram-home">
            <section className="meta-instagram-stream" aria-label="Instagram feed">
              <StoryStrip stories={stories} product="instagram" />
              <PostList {...props} product="instagram" />
            </section>
            <SuggestionsPanel
              product="instagram"
              suggestions={suggestions}
              followingIds={props.followingIds}
              toggleFollow={props.toggleFollow}
              userName={userName}
            />
          </div>
        )}
        {view === 'explore' && (
          <SocialExplore
            product="instagram"
            query={query}
            setQuery={setQuery}
            posts={props.visiblePosts}
            selectedPostId={props.selectedPostId}
            selectPost={props.selectPost}
          />
        )}
        {view === 'profile' && <SocialProfile {...props} product="instagram" />}
      </main>
    </div>
  )
}

function FacebookShowcase(props: ProductRendererProps) {
  const { view, setView, query, setQuery, userName } = props
  return (
    <div className="meta-facebook-shell">
      <header className="meta-facebook-topbar">
        <SocialLogo product="facebook" />
        <SearchControl
          label="Search Facebook"
          value={query}
          onChange={setQuery}
          compact
        />
        <nav aria-label="Facebook primary">
          <NavIcon label="Home" icon="home" active={view === 'feed'} onClick={() => setView('feed')} />
          <NavIcon label="Video" icon="play" />
          <NavIcon label="Groups" icon="people" active={view === 'groups'} onClick={() => setView('groups')} />
          <NavIcon label="Business page" icon="flag" active={view === 'business-page'} onClick={() => setView('business-page')} />
        </nav>
        <div className="meta-facebook-actions">
          <NavIcon label="Menu" icon="apps" />
          <NavIcon label="Messenger" icon="message" />
          <NavIcon label="Notifications" icon="bell" />
          <SocialAvatar author={AUTHORS.jun} size={38} />
        </div>
      </header>
      <div className="meta-facebook-body">
        <aside className="meta-facebook-left" aria-label="Facebook shortcuts">
          <FacebookSideItem author={AUTHORS.jun} label={userName} />
          <FacebookSideItem icon="people" label="Friends" />
          <FacebookSideItem icon="clock" label="Memories" />
          <FacebookSideItem icon="bookmark" label="Saved" />
          <FacebookSideItem icon="people" label="Groups" active={view === 'groups'} onClick={() => setView('groups')} />
          <FacebookSideItem icon="video" label="Video" />
          <FacebookSideItem icon="flag" label="Pages" active={view === 'business-page'} onClick={() => setView('business-page')} />
          <hr />
          <h2>Your shortcuts</h2>
          <FacebookSideItem icon="layers" label="Founder operators" />
          <FacebookSideItem icon="chart" label="Business analytics" />
          <FacebookSideItem icon="camera" label="Jim Technologies team" />
        </aside>
        <main className="meta-facebook-main">
          {view === 'feed' && (
            <>
              <StoryStrip stories={props.stories} product="facebook" />
              <SocialComposer product="facebook" userName={userName} />
              <PostList {...props} product="facebook" />
            </>
          )}
          {view === 'groups' && <FacebookGroups {...props} />}
          {view === 'business-page' && <FacebookBusinessPage {...props} />}
        </main>
        <aside
          className="meta-facebook-right"
          aria-label="Facebook contacts and sponsored content"
        >
          <section>
            <h2>Sponsored</h2>
            <div className="meta-facebook-sponsored">
              <img src={scene('studio')} alt="" />
              <span><strong>Build a clearer operating rhythm</strong><small>jimtech.xyz</small></span>
            </div>
          </section>
          <section>
            <h2>Contacts</h2>
            {props.suggestions.map(item => (
              <button type="button" key={item.id}>
                <SocialAvatar author={item.author} size={31} presence />
                <span>{item.author.name}</span>
              </button>
            ))}
          </section>
        </aside>
      </div>
    </div>
  )
}

function ThreadsShowcase(props: ProductRendererProps) {
  const { view, setView, query, setQuery, userName } = props
  return (
    <div className="meta-threads-shell">
      <SocialRail
        product="threads"
        userName={userName}
        items={[
          { view: 'for-you', label: 'Home', icon: 'home' },
          { view: 'for-you', label: 'Search', icon: 'search' },
          { view: 'for-you', label: 'Create', icon: 'plus' },
          { view: 'following', label: 'Activity', icon: 'heart' },
          { view: 'profile', label: 'Profile', icon: 'user' },
        ]}
        activeView={view}
        setView={setView}
        compact
      />
      <main className="meta-threads-main">
        <header>
          <SocialLogo product="threads" />
          {view !== 'profile' ? (
            <nav aria-label="Threads feed">
              <button
                type="button"
                className={view === 'for-you' ? 'is-active' : ''}
                onClick={() => setView('for-you')}
              >
                For you
              </button>
              <button
                type="button"
                className={view === 'following' ? 'is-active' : ''}
                onClick={() => setView('following')}
              >
                Following
              </button>
            </nav>
          ) : <strong>Profile</strong>}
          <NavIcon label="More" icon="more" />
        </header>
        {view === 'profile' ? (
          <SocialProfile {...props} product="threads" />
        ) : (
          <>
            <SocialComposer product="threads" userName={userName} />
            <PostList {...props} product="threads" />
          </>
        )}
      </main>
      <aside className="meta-threads-discovery" aria-label="Threads discovery">
        <SearchControl
          label="Search Threads"
          value={query}
          onChange={setQuery}
        />
        <SuggestionsPanel
          product="threads"
          suggestions={props.suggestions}
          followingIds={props.followingIds}
          toggleFollow={props.toggleFollow}
          userName={userName}
        />
      </aside>
    </div>
  )
}

interface RailItem {
  view: string
  label: string
  icon: OperationalShowcaseIconName
}

function SocialRail({
  product,
  items,
  activeView,
  setView,
  userName,
  compact = false,
}: {
  product: 'instagram' | 'threads'
  items: readonly RailItem[]
  activeView: string
  setView: (view: string) => void
  userName: string
  compact?: boolean
}) {
  return (
    <aside
      className={`meta-social-rail ${compact ? 'is-compact' : ''}`}
      aria-label={`${productName(product)} sidebar`}
    >
      <SocialLogo product={product} />
      <nav aria-label={`${productName(product)} navigation`}>
        {items.map((item, index) => (
          <button
            type="button"
            key={`${item.label}:${index}`}
            aria-label={item.label}
            className={activeView === item.view && (
              item.label === 'Home'
              || item.label === 'Profile'
              || item.label === 'Activity'
            ) ? 'is-active' : ''}
            onClick={() => setView(item.view)}
          >
            {item.label === 'Profile'
              ? <SocialAvatar author={AUTHORS.jun} size={25} />
              : <OperationalShowcaseIcon name={item.icon} size={23} />}
            <span>{item.label}</span>
          </button>
        ))}
      </nav>
      <button type="button" className="meta-social-more" aria-label="More">
        <OperationalShowcaseIcon name="menu" size={23} />
        <span>More</span>
        <span className="meta-social-user-name">{userName}</span>
      </button>
    </aside>
  )
}

function SocialLogo({ product }: { product: MetaSocialProduct }) {
  const label = productName(product)
  return (
    <span
      className={`meta-social-logo is-${product}`}
      role="img"
      aria-label={label}
      title={label}
    >
      <b aria-hidden="true">
        {product === 'instagram' ? '◎' : product === 'facebook' ? 'f' : '@'}
      </b>
      <span>{label}</span>
    </span>
  )
}

function productName(product: MetaSocialProduct): string {
  if (product === 'instagram') return 'Instagram'
  if (product === 'facebook') return 'Facebook'
  return 'Threads'
}

function SocialAvatar({
  author: item,
  size = 34,
  presence = false,
}: {
  author: MetaSocialAuthor
  size?: number
  presence?: boolean
}) {
  const initials = item.name.split(/\s+/).slice(0, 2).map(part => part[0]).join('').toUpperCase()
  return (
    <span
      className={`meta-social-avatar ${presence ? 'has-presence' : ''}`}
      style={{
        '--meta-avatar-size': `${size}px`,
        '--meta-avatar-color': item.color ?? '#5f6f82',
      } as CSSProperties}
      title={item.name}
      role="img"
      aria-label={item.name}
    >
      {initials}
    </span>
  )
}

function Verified() {
  return (
    <span
      className="meta-social-verified"
      role="img"
      title="Verified"
      aria-label="Verified"
    >
      ✓
    </span>
  )
}

function SearchControl({
  label,
  value,
  onChange,
  compact = false,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  compact?: boolean
}) {
  return (
    <label className={`meta-social-search ${compact ? 'is-compact' : ''}`}>
      <OperationalShowcaseIcon name="search" size={17} />
      <span className="meta-social-sr-only">{label}</span>
      <input
        type="search"
        value={value}
        onChange={event => onChange(event.target.value)}
        placeholder={label}
      />
    </label>
  )
}

function NavIcon({
  label,
  icon,
  active = false,
  onClick,
}: {
  label: string
  icon: OperationalShowcaseIconName
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button
      type="button"
      className={`meta-social-icon-button ${active ? 'is-active' : ''}`}
      aria-label={label}
      aria-pressed={onClick ? active : undefined}
      onClick={onClick}
    >
      <OperationalShowcaseIcon name={icon} size={22} />
    </button>
  )
}

function StoryStrip({
  stories,
  product,
}: {
  stories: readonly MetaSocialStory[]
  product: 'instagram' | 'facebook'
}) {
  return (
    <section className={`meta-story-strip is-${product}`} aria-label="Stories">
      {stories.map((item, index) => (
        <button type="button" key={item.id} className={item.seen ? 'is-seen' : ''}>
          <span className="meta-story-media">
            <img src={item.imageUrl} alt="" />
            <SocialAvatar author={item.author} size={product === 'facebook' ? 34 : 48} />
            {index === 0 && <i aria-hidden="true">+</i>}
          </span>
          <span>{item.title}</span>
        </button>
      ))}
    </section>
  )
}

function PostList(props: ProductRendererProps & { product: MetaSocialProduct }) {
  if (props.visiblePosts.length === 0) {
    return (
      <div className="meta-social-empty">
        <OperationalShowcaseIcon name="search" size={28} />
        <strong>No posts found</strong>
        <span>Try a different name, handle, or topic.</span>
      </div>
    )
  }
  return (
    <div className={`meta-post-list is-${props.product}`}>
      {props.visiblePosts.map(post => (
        <SocialPostCard
          key={post.id}
          product={props.product}
          post={post}
          selected={props.selectedPostId === post.id}
          liked={props.likedIds.has(post.id)}
          saved={props.savedIds.has(post.id)}
          selectPost={props.selectPost}
          toggleLike={props.toggleLike}
          toggleSave={props.toggleSave}
        />
      ))}
    </div>
  )
}

function SocialPostCard({
  product,
  post,
  selected,
  liked,
  saved,
  selectPost,
  toggleLike,
  toggleSave,
}: {
  product: MetaSocialProduct
  post: MetaSocialPost
  selected: boolean
  liked: boolean
  saved: boolean
  selectPost: (postId: string) => void
  toggleLike: (postId: string) => void
  toggleSave: (postId: string) => void
}) {
  if (product === 'instagram') {
    return (
      <article className={`meta-post-card is-instagram ${selected ? 'is-selected' : ''}`}>
        <PostAuthor post={post} product={product} />
        {post.imageUrl && (
          <button
            type="button"
            className="meta-post-media"
            onClick={() => selectPost(post.id)}
            aria-label={`Open post by ${post.author.name}`}
          >
            <img src={post.imageUrl} alt={post.imageAlt ?? ''} />
          </button>
        )}
        <PostActions
          post={post}
          liked={liked}
          saved={saved}
          toggleLike={toggleLike}
          toggleSave={toggleSave}
        />
        <strong className="meta-post-likes">{formatCount(post.likes + (liked && !post.liked ? 1 : 0))} likes</strong>
        <p className="meta-post-copy"><b>{post.author.handle}</b> {post.body}</p>
        <button type="button" className="meta-post-comments" onClick={() => selectPost(post.id)}>
          View all {formatCount(post.comments)} comments
        </button>
        <time>{post.timestamp} ago</time>
      </article>
    )
  }

  if (product === 'facebook') {
    return (
      <article className={`meta-post-card is-facebook ${selected ? 'is-selected' : ''}`}>
        <PostAuthor post={post} product={product} />
        <p className="meta-post-copy">{post.body}</p>
        {post.imageUrl && (
          <button
            type="button"
            className="meta-post-media"
            onClick={() => selectPost(post.id)}
            aria-label={`Open post by ${post.author.name}`}
          >
            <img src={post.imageUrl} alt={post.imageAlt ?? ''} />
          </button>
        )}
        <div className="meta-facebook-reactions">
          <span>● ♥ {formatCount(post.likes + (liked && !post.liked ? 1 : 0))}</span>
          <span>{post.comments} comments · {post.shares} shares</span>
        </div>
        <PostActions
          post={post}
          liked={liked}
          saved={saved}
          toggleLike={toggleLike}
          toggleSave={toggleSave}
          facebook
        />
      </article>
    )
  }

  return (
    <article className={`meta-post-card is-threads ${selected ? 'is-selected' : ''}`}>
      <SocialAvatar author={post.author} size={39} />
      <div className="meta-thread-line" aria-hidden="true" />
      <div className="meta-thread-content">
        <PostAuthor post={post} product={product} compact />
        <p className="meta-post-copy">{post.body}</p>
        {post.imageUrl && (
          <button
            type="button"
            className="meta-post-media"
            onClick={() => selectPost(post.id)}
            aria-label={`Open post by ${post.author.name}`}
          >
            <img src={post.imageUrl} alt={post.imageAlt ?? ''} />
          </button>
        )}
        <PostActions
          post={post}
          liked={liked}
          saved={saved}
          toggleLike={toggleLike}
          toggleSave={toggleSave}
        />
        <button type="button" className="meta-thread-replies" onClick={() => selectPost(post.id)}>
          {post.comments} replies · {formatCount(post.likes + (liked && !post.liked ? 1 : 0))} likes
        </button>
      </div>
    </article>
  )
}

function PostAuthor({
  post,
  product,
  compact = false,
}: {
  post: MetaSocialPost
  product: MetaSocialProduct
  compact?: boolean
}) {
  return (
    <header className={`meta-post-author ${compact ? 'is-compact' : ''}`}>
      {!compact && <SocialAvatar author={post.author} size={product === 'facebook' ? 40 : 34} />}
      <span>
        <strong>
          {product === 'instagram' ? post.author.handle : post.author.name}
          {post.author.verified && <Verified />}
        </strong>
        {!compact && (
          <small>
            {product === 'facebook'
              ? `${post.author.subtitle ?? `@${post.author.handle}`} · ${post.timestamp} · ${post.audience ?? 'Public'}`
              : post.location ?? post.author.subtitle}
          </small>
        )}
      </span>
      {compact && <time>{post.timestamp}</time>}
      <NavIcon label="Post options" icon="more" />
    </header>
  )
}

function PostActions({
  post,
  liked,
  saved,
  toggleLike,
  toggleSave,
  facebook = false,
}: {
  post: MetaSocialPost
  liked: boolean
  saved: boolean
  toggleLike: (postId: string) => void
  toggleSave: (postId: string) => void
  facebook?: boolean
}) {
  return (
    <div className={`meta-post-actions ${facebook ? 'is-facebook' : ''}`}>
      <button
        type="button"
        className={liked ? 'is-active' : ''}
        aria-label={liked ? 'Unlike post' : 'Like post'}
        aria-pressed={liked}
        onClick={() => toggleLike(post.id)}
      >
        <OperationalShowcaseIcon name="heart" size={facebook ? 19 : 23} />
        {facebook && <span>Like</span>}
      </button>
      <button type="button" aria-label="Comment on post">
        <OperationalShowcaseIcon name="message" size={facebook ? 19 : 23} />
        {facebook && <span>Comment</span>}
      </button>
      <button type="button" aria-label="Share post">
        <OperationalShowcaseIcon name="send" size={facebook ? 19 : 23} />
        {facebook && <span>Share</span>}
      </button>
      {!facebook && (
        <button
          type="button"
          className={`meta-post-save ${saved ? 'is-active' : ''}`}
          aria-label={saved ? 'Remove from saved' : 'Save post'}
          aria-pressed={saved}
          onClick={() => toggleSave(post.id)}
        >
          <OperationalShowcaseIcon name="bookmark" size={23} />
        </button>
      )}
    </div>
  )
}

function SuggestionsPanel({
  product,
  suggestions,
  followingIds,
  toggleFollow,
  userName,
}: {
  product: 'instagram' | 'threads'
  suggestions: readonly MetaSocialSuggestion[]
  followingIds: ReadonlySet<string>
  toggleFollow: (authorId: string) => void
  userName: string
}) {
  return (
    <section className={`meta-suggestions is-${product}`}>
      <header>
        <SocialAvatar author={AUTHORS.jun} size={42} />
        <span><strong>{product === 'instagram' ? 'jun' : userName}</strong><small>{CLONE_DEMO_IDENTITY.email}</small></span>
        <button type="button">Switch</button>
      </header>
      <div className="meta-suggestion-heading">
        <strong>Suggested for you</strong>
        <button type="button">See all</button>
      </div>
      {suggestions.map(item => {
        const following = followingIds.has(item.author.id)
        return (
          <div className="meta-suggestion-row" key={item.id}>
            <SocialAvatar author={item.author} size={34} />
            <span><strong>{item.author.handle}{item.author.verified && <Verified />}</strong><small>{item.reason}</small></span>
            <button type="button" onClick={() => toggleFollow(item.author.id)}>
              {following ? 'Following' : 'Follow'}
            </button>
          </div>
        )
      })}
      <footer>About · Help · Privacy · Terms · Locations · Meta Verified</footer>
    </section>
  )
}

function SocialExplore({
  product,
  query,
  setQuery,
  posts,
  selectedPostId,
  selectPost,
}: {
  product: MetaSocialProduct
  query: string
  setQuery: (query: string) => void
  posts: readonly MetaSocialPost[]
  selectedPostId: string
  selectPost: (postId: string) => void
}) {
  return (
    <section className="meta-social-explore">
      <header>
        <div><h1>Explore</h1><span>Discover people and ideas relevant to your work.</span></div>
        <SearchControl label={`Search ${productName(product)}`} value={query} onChange={setQuery} />
      </header>
      {posts.length > 0 ? (
        <div className="meta-explore-grid">
          {posts.map((post, index) => (
            <button
              type="button"
              key={post.id}
              className={`${selectedPostId === post.id ? 'is-selected' : ''} ${index % 5 === 0 ? 'is-tall' : ''}`}
              onClick={() => selectPost(post.id)}
              aria-label={`Open ${post.author.name}'s post`}
            >
              {post.imageUrl
                ? <img src={post.imageUrl} alt={post.imageAlt ?? ''} />
                : <span>{post.body}</span>}
              <i><OperationalShowcaseIcon name="heart" size={17} />{formatCount(post.likes)}</i>
            </button>
          ))}
        </div>
      ) : <div className="meta-social-empty"><strong>No matches</strong></div>}
    </section>
  )
}

function SocialProfile(props: ProductRendererProps & { product: MetaSocialProduct }) {
  const posts = props.allPosts.filter(post =>
    post.author.id === 'jun' || post.author.id === 'jim-technologies',
  )
  return (
    <section className={`meta-social-profile is-${props.product}`}>
      <header>
        <SocialAvatar author={AUTHORS.jim} size={86} />
        <div>
          <div className="meta-profile-title">
            <h1>{props.product === 'instagram' ? 'jimtech' : props.companyName}</h1>
            <button type="button">{props.product === 'threads' ? 'Edit profile' : 'Following'}</button>
            <NavIcon label="Profile options" icon="more" />
          </div>
          <dl>
            <div><dt>{posts.length}</dt><dd>posts</dd></div>
            <div><dt>18.4K</dt><dd>followers</dd></div>
            <div><dt>286</dt><dd>following</dd></div>
          </dl>
          <strong>{props.companyName}</strong>
          <p>Composable operating software for ambitious teams.</p>
          <a href="https://jimtech.xyz">jimtech.xyz</a>
        </div>
      </header>
      <nav aria-label="Profile content">
        <button type="button" className="is-active"><OperationalShowcaseIcon name="apps" size={14} /> Posts</button>
        <button type="button"><OperationalShowcaseIcon name="bookmark" size={14} /> Saved</button>
        <button type="button"><OperationalShowcaseIcon name="user" size={14} /> Tagged</button>
      </nav>
      <div className="meta-profile-grid">
        {posts.concat(props.allPosts.slice(1, 5)).map((post, index) => (
          <button type="button" key={`${post.id}:${index}`} onClick={() => props.selectPost(post.id)}>
            {post.imageUrl
              ? <img src={post.imageUrl} alt={post.imageAlt ?? ''} />
              : <span>{post.body}</span>}
            <i>{formatCount(post.likes)} likes</i>
          </button>
        ))}
      </div>
    </section>
  )
}

function SocialComposer({
  product,
  userName,
}: {
  product: 'facebook' | 'threads'
  userName: string
}) {
  const placeholder = product === 'facebook'
    ? `What's on your mind, ${userName}?`
    : 'Start a thread...'
  return (
    <section className={`meta-social-composer is-${product}`}>
      <SocialAvatar author={AUTHORS.jun} size={product === 'facebook' ? 40 : 36} />
      {product === 'facebook' ? (
        <button type="button" className="meta-composer-prompt">{placeholder}</button>
      ) : (
        <label>
          <span className="meta-social-sr-only">{placeholder}</span>
          <textarea placeholder={placeholder} rows={2} />
        </label>
      )}
      {product === 'threads' && <button type="button" className="meta-composer-submit">Post</button>}
      <footer>
        {product === 'facebook' ? (
          <>
            <button type="button"><OperationalShowcaseIcon name="video" size={20} /><span>Live video</span></button>
            <button type="button"><OperationalShowcaseIcon name="camera" size={20} /><span>Photo/video</span></button>
            <button type="button"><OperationalShowcaseIcon name="sparkles" size={20} /><span>Feeling/activity</span></button>
          </>
        ) : (
          <>
            <button type="button" aria-label="Attach photo"><OperationalShowcaseIcon name="camera" size={19} /></button>
            <button type="button" aria-label="Add link"><OperationalShowcaseIcon name="link" size={19} /></button>
            <button type="button" aria-label="Add topic"><OperationalShowcaseIcon name="tag" size={19} /></button>
          </>
        )}
      </footer>
    </section>
  )
}

function FacebookSideItem({
  icon,
  author: item,
  label,
  active = false,
  onClick,
}: {
  icon?: OperationalShowcaseIconName
  author?: MetaSocialAuthor
  label: string
  active?: boolean
  onClick?: () => void
}) {
  return (
    <button type="button" className={active ? 'is-active' : ''} onClick={onClick}>
      {item ? <SocialAvatar author={item} size={31} /> : icon && <OperationalShowcaseIcon name={icon} size={25} />}
      <span>{label}</span>
    </button>
  )
}

function FacebookGroups(props: ProductRendererProps) {
  const groups = [
    ['Founder operators', '18.2K members · 14 new posts', 'harbor'],
    ['Business analytics', '8.7K members · 6 new posts', 'studio'],
    ['Customer-led growth', '12.4K members · 9 new posts', 'city'],
  ] as const
  return (
    <section className="meta-facebook-groups">
      <header><div><span>Groups</span><h1>Your groups</h1></div><button type="button">+ Create new group</button></header>
      <div className="meta-facebook-group-grid">
        {groups.map(group => (
          <button type="button" key={group[0]}>
            <img src={scene(group[2])} alt="" />
            <span><strong>{group[0]}</strong><small>{group[1]}</small></span>
          </button>
        ))}
      </div>
      <h2>Recent activity</h2>
      <PostList {...props} product="facebook" />
    </section>
  )
}

function FacebookBusinessPage(props: ProductRendererProps) {
  const companyPosts = props.visiblePosts.filter(post =>
    post.author.id === 'jim-technologies' || post.author.id === 'jun',
  )
  return (
    <section className="meta-facebook-page">
      <div className="meta-facebook-page-cover">
        <img src={scene('ridge')} alt="Abstract mountain ridge cover" />
      </div>
      <header>
        <SocialAvatar author={AUTHORS.jim} size={94} />
        <div><h1>{props.companyName}<Verified /></h1><p>18K followers · 286 following</p></div>
        <button type="button">+ Add to story</button>
        <button type="button">Edit profile</button>
      </header>
      <nav aria-label="Business page sections">
        <button type="button" className="is-active">Posts</button>
        <button type="button">About</button>
        <button type="button">Mentions</button>
        <button type="button">Reviews</button>
        <button type="button">Followers</button>
      </nav>
      <div className="meta-facebook-page-layout">
        <aside aria-label="Business page summary">
          <h2>Intro</h2>
          <p>Composable operating software for ambitious teams.</p>
          <span><OperationalShowcaseIcon name="globe" size={17} /> jimtech.xyz</span>
          <span><OperationalShowcaseIcon name="location" size={17} /> San Francisco, California</span>
          <button type="button">Edit details</button>
          <dl>
            <div><dt>18,420</dt><dd>Followers</dd></div>
            <div><dt>4.9</dt><dd>Rating</dd></div>
            <div><dt>96%</dt><dd>Response</dd></div>
          </dl>
        </aside>
        <div>
          <SocialComposer product="facebook" userName={props.userName} />
          <PostList {...props} visiblePosts={companyPosts} product="facebook" />
        </div>
      </div>
    </section>
  )
}

function formatCount(value: number): string {
  return new Intl.NumberFormat('en-US', {
    notation: value >= 1000 ? 'compact' : 'standard',
    maximumFractionDigits: 1,
  }).format(value)
}
