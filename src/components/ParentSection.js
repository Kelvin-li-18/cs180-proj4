import React from 'react';
import Section from './Section';

function ParentSection({ id, title, sections }) {
  return (
<div id={id} className="mb-16 sm:mb-12 scroll-mt-10 sm:scroll-mt-8 md:scroll-mt-12">
<h1 className="text-3xl md:text-4xl font-bold mb-6 md:mb-10 text-indigo-400">{title}</h1>

      {sections.map((section) => (
        <Section
          key={section.id}
          id={section.id}
          title={section.title}
          content={section.content}
        />
      ))}
    </div>
  );
}

export default ParentSection;
