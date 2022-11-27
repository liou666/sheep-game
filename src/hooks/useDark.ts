const useDarkStorage = (defaultValue?: boolean) => {
  const isDarkOS = useMediaQuery('(prefers-color-scheme: dark)')
  const [isDarkMode, setDarkMode] = useLocalStorageState(
    'dark-mode',
    {
      defaultValue: defaultValue ?? isDarkOS ?? false,
    },
  )
  useUpdateEffect(() => {
    setDarkMode(isDarkOS)
  }, [isDarkOS])

  return [
    isDarkMode,
    () => setDarkMode(prev => !prev),
  ] as const
}

const useDark = () => {
  const [isDark, toggleDark] = useDarkStorage()

  useEffect(() => {
    if (isDark)
      document.documentElement.classList.add('dark')

    else
      document.documentElement.classList.remove('dark')
  }, [isDark])

  return [
    isDark,
    toggleDark,
  ] as const
}

export default useDark
