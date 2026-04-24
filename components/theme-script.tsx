const SCRIPT = `(function(){try{var s=localStorage.getItem('theme')||'system';var d=s==='system'?(window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light'):s;var r=document.documentElement;r.classList.remove('light','dark');r.classList.add(d);r.style.colorScheme=d;}catch(e){}})();`

export function ThemeScript() {
  return (
    <script
      suppressHydrationWarning
      dangerouslySetInnerHTML={{ __html: SCRIPT }}
    />
  )
}
