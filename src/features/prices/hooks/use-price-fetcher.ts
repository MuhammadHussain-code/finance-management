export function usePriceFetcher() {
  return {
    fetchPrice: async () => null,
    isAutoEnabled: false,
    supportedSymbols: [] as string[],
  };
}
