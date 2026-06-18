import { Moon, Sun } from 'lucide-react'
import { Button } from '#/components/ui/button'
import { useTheme } from '#/hooks/use-theme'

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, toggleTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <Button
      type="button"
      variant="outline"
      size={compact ? 'icon' : 'default'}
      className="h-10 border-[#c7ddb5] bg-white text-[#64745F] hover:bg-[#ddead1]/60 hover:text-[#658354] dark:border-[#2f4a32] dark:bg-[#132018] dark:text-[#d6e8cf] dark:hover:bg-[#203423]"
      onClick={toggleTheme}
      aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      title={isDark ? 'Light mode' : 'Dark mode'}
    >
      {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
      {compact ? null : <span>{isDark ? 'Light' : 'Dark'}</span>}
    </Button>
  )
}
