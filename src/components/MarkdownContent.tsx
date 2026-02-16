'use client';

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export default function MarkdownContent({ content }: { content: string }) {
  return (
    <div className="prose prose-lg max-w-none prose-headings:text-brand-dark prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-gray-700 prose-p:leading-relaxed prose-li:text-gray-700 prose-strong:text-brand-dark prose-a:text-brand-wine prose-a:no-underline hover:prose-a:underline prose-table:border-collapse prose-th:bg-brand-dark prose-th:text-white prose-th:px-4 prose-th:py-2 prose-th:text-left prose-td:px-4 prose-td:py-2 prose-td:border prose-td:border-gray-200 prose-tr:even:bg-gray-50">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
