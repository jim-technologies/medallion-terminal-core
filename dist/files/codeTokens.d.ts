/**
 * A small, bounded syntax highlighter for the source formats a data platform
 * shows most: JSON, YAML and SQL. It works one line at a time with sticky
 * regular expressions (no backtracking across lines, no state), produces
 * plain text runs for React to render as text nodes, and leaves lines
 * longer than `MAX_HIGHLIGHT_LINE` unhighlighted. Anything it does not
 * recognise stays plain.
 */
/** A token's role; each maps to a `--mtc-code-*` colour. */
export type CodeTokenKind = 'key' | 'string' | 'number' | 'literal' | 'keyword' | 'comment' | 'plain';
export interface CodeToken {
    kind: CodeTokenKind;
    text: string;
}
/** Languages with highlighting. */
export type CodeLanguage = 'json' | 'yaml' | 'sql';
/** Lines longer than this render plain. */
export declare const MAX_HIGHLIGHT_LINE = 2000;
/** The highlighter for a language name or file extension, if there is one. */
export declare function codeLanguage(name?: string): CodeLanguage | null;
/** One line as tokens; adjacent plain text is merged. */
export declare function tokenizeLine(line: string, language: CodeLanguage): CodeToken[];
