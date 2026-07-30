export const LANGUAGE_OPTIONS = [
  { label: 'C++', value: 'cpp' },
  { label: 'Java', value: 'java' },
  { label: 'Python', value: 'python' },
  { label: 'JavaScript', value: 'javascript' },
];

export const DEFAULT_CODE = {
  cpp: '#include <bits/stdc++.h>\nusing namespace std;\n\nint main() {\n  return 0;\n}',
  java: 'class Main {\n  public static void main(String[] args) {\n  }\n}',
  python: 'def solve():\n    pass\n\nif __name__ == "__main__":\n    solve()',
  javascript: 'function solve() {\n}\n\nsolve();',
};
