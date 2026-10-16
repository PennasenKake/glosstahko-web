import { site } from '../../config/site'
import { instagramPosts } from '../../data/instagram'

/**
 * Pieni Instagram-syöte: uusimmat nostot korteissa, jotka linkittävät
 * alkuperäiseen nostoon. Sisältö: data/instagram.ts. Ei ulkopuolisia
 * skriptejä eikä evästeitä, vain tavallisia linkkejä.
 * Ulkoasu: styles/components.css (.insta).
 */
export default function InstagramFeed() {
  return (
    <div className="insta">
      <p className="insta__title">
        Instagramissa <a href={site.instagramUrl} target="_blank" rel="noopener noreferrer">{site.instagramHandle}</a>
      </p>

      <ul className="insta__list">
        {instagramPosts.map((post) => (
          <li className="insta__item" key={post.id}>
            <a
              className="insta__card"
              href={`${site.instagramUrl}p/${post.id}/`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {post.image && (
                <img className="insta__image" src={post.image} alt={post.imageAlt ?? ''} loading="lazy" />
              )}
              <span className="insta__text">{post.text}</span>
              <span className="insta__meta">
                {post.date} <span aria-hidden="true">·</span> Avaa Instagramissa<span className="sr-only"> (uusi välilehti)</span>
              </span>
            </a>
          </li>
        ))}
      </ul>

      <a className="btn btn--ghost" href={site.instagramUrl} target="_blank" rel="noopener noreferrer">
        Seuraa Instagramissa
      </a>
    </div>
  )
}
