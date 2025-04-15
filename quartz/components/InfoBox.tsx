// quartz/components/Infobox.tsx
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { classNames } from "../util/lang"
import { JSX } from "preact"
import style from "./styles/infobox.scss"

// Define the structure we expect in the frontmatter
interface InfoboxData {
  title?: string
  image?: string
  // Allow any other string keys with string values
  [key: string]: string | undefined
}

export default ((opts?: object) => {
  function InfoBox({ fileData, displayClass }: QuartzComponentProps) {
    const frontmatter = fileData.frontmatter
    // Check if the infobox key exists and is an object
    if (!frontmatter?.infobox || typeof frontmatter.infobox !== 'object') {
      return null // Don't render anything if 'infobox' isn't defined or isn't an object
    }

    // Type assertion after check
    const infoboxData = frontmatter.infobox as InfoboxData

    const { title, image, ...data } = infoboxData; // Separate title and image from other data

    // Filter out empty/null values from the main data
    const validData = Object.entries(data)
      .filter(([key, value]) => value !== null && value !== undefined && value !== "")
      .reduce((obj, [key, value]) => {
        // Convert PascalCase or camelCase keys to Title Case for display labels
        const label = key
          .replace(/([A-Z])/g, ' $1') // Add space before uppercase letters
          .replace(/^./, (str) => str.toUpperCase()); // Capitalize first letter
        obj[label] = value as string; // Assert value is string after filtering
        return obj;
      }, {} as Record<string, string>);


    if (Object.keys(validData).length === 0 && !title && !image) {
      return null; // Don't render if there's no title, image, or data to show
    }

    return (
      <aside class={classNames(displayClass, "infobox")}>
        {title && <h3 class="infobox-title">{title}</h3>}
        {image && <img src={image} alt={title || 'Infobox image'} class="infobox-image" />}
        {Object.keys(validData).length > 0 && (
          <dl class="infobox-data">
            {Object.entries(validData).map(([key, value]) => (
              <>
                <dt>{key}</dt>
                {/* Use dangerouslySetInnerHTML ONLY if you trust the source or sanitize it.
                    Otherwise, just render value as text. For simplicity, we render as text.
                    If you need links or basic formatting, consider a Markdown parser for frontmatter
                    or instruct users to use HTML (with caution). */}
                <dd>{value}</dd>
              </>
            ))}
          </dl>
        )}
      </aside>
    )
  }

  InfoBox.css = style // Embed the CSS
  return InfoBox
}) satisfies QuartzComponentConstructor