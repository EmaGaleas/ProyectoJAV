import { useState, useEffect, useMemo } from 'react'
import { useAuthStore } from '../../auth/store/authStore'
import { fetchIngresos, fetchDetalleIngreso } from './ingresoService'
import type { Income, IncomeDetail } from './types'
import { DEFAULT_FILTERS } from './IncomeFilters'
import type { Filters } from './IncomeFilters'

export function useIncomeHistorial() {
  const { token } = useAuthStore()

  const [records,      setRecords]      = useState<Income[]>([])
  const [selected,     setSelected]     = useState<Income | null>(null)
  const [detail,       setDetail]       = useState<IncomeDetail | null>(null)
  const [detailLoading, setDetailLoading] = useState(false)
  const [search,       setSearch]       = useState('')
  const [filters,      setFilters]      = useState<Filters>(DEFAULT_FILTERS)
  const [activeFilters, setActiveFilters] = useState<Filters>(DEFAULT_FILTERS)
  const [filtersOpen,  setFiltersOpen]  = useState(false)

  useEffect(() => {
    if (!token) return
    fetchIngresos({}, token).then(setRecords).catch(console.error)
  }, [token])

  useEffect(() => {
    if (!selected) { setDetail(null); return }
    setDetailLoading(true)
    fetchDetalleIngreso(selected.id, token!)
      .then(setDetail)
      .catch(console.error)
      .finally(() => setDetailLoading(false))
  }, [selected, token])

  const filtered = useMemo(() =>
    records.filter(inc => {
      const q = search.toLowerCase()
      const matchSearch = !search || inc.holderName.toLowerCase().includes(q) || inc.dni.toLowerCase().includes(q)
      const matchType   = !activeFilters.paymentType || inc.paymentType === activeFilters.paymentType
      const matchStatus = !activeFilters.status      || inc.status      === activeFilters.status
      const matchFrom   = !activeFilters.dateFrom    || inc.date >= activeFilters.dateFrom
      const matchTo     = !activeFilters.dateTo      || inc.date <= activeFilters.dateTo
      return matchSearch && matchType && matchStatus && matchFrom && matchTo
    }),
  [records, search, activeFilters])

  const handleApply = () => { setActiveFilters(filters); setFiltersOpen(false) }

  const handleClose = () => { setSelected(null); setDetail(null) }

  return {
    filtered,
    selected,
    detail,
    detailLoading,
    search,
    setSearch,
    filters,
    setFilters,
    filtersOpen,
    setFiltersOpen,
    setSelected,
    handleApply,
    handleClose,
  }
}
