import React from 'react';
import ImageCard from './ImageCard';
import ImageGrid from './ImageGrid';
import 'katex/dist/katex.min.css';
import Latex from 'react-latex-next';

function Section({ id, title, content }) {
  return (
    <div id={id} className="mb-16 sm:mb-12 scroll-mt-10 sm:scroll-mt-8 md:scroll-mt-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{title}</h2>

      <div className="space-y-6">
        {content.map((item, index) => {
          // Handle paragraphs
          if (item.type === 'paragraph') {
            return (
              <p key={index} className="text-lg text-gray-400 leading-relaxed break-words">
                {item.text}
              </p>
            );
          }
          // Handle LaTeX math content
          if (item.type === 'math') {
            return (
              <div key={index} className="text-center text-2xl text-gray-300 break-words leading-relaxed my-6">
                <Latex>{item.text}</Latex>
              </div>
            );
          }
          // Handle image grids
          if (item.type === 'image-grid') {
            return (
              <ImageGrid key={index} columns={item.columns}>
                {item.images.map((image, imgIndex) => (
                  <ImageCard key={imgIndex} title={image.title} imageUrl={image.imageUrl} />
                ))}
              </ImageGrid>
            );
          }
          // Handle lists
          if (item.type === 'list') {
            return (
              <ol key={index} className="list-decimal ml-6 space-y-2 text-lg text-gray-400 leading-relaxed">
                {item.items.map((listItem, i) => {
                  // Check if there's a sublist inside the list
                  if (typeof listItem === 'object' && listItem.sublist) {
                    return (
                      <li key={i}>
                        {listItem.text}
                        <ul className="list-disc ml-4">
                          {listItem.sublist.map((sublistItem, subIndex) => {
                            // Handle LaTeX in sublist without bullet point and centered
                            if (sublistItem.type === 'math') {
                              return (
                                <div key={subIndex} className="text-center text-2xl text-gray-300 my-6">
                                  <Latex>{sublistItem.text}</Latex>
                                </div>
                              );
                            }
                            return <li key={subIndex}>{sublistItem}</li>;
                          })}
                        </ul>
                      </li>
                    );
                  }
                  return <li key={i}>{listItem}</li>;
                })}
              </ol>
            );
          }
          return null;
        })}
      </div>
    </div>
  );
}

export default Section;
