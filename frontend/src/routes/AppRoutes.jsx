import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '@/components/layout/AppLayout'
import AuthLayout from '@/components/layout/AuthLayout'
import PublicShell from '@/components/layout/PublicShell'
import Spinner from '@/components/common/Spinner'
import { ROUTES } from '@/constants/routes'
import AdminRoute from './AdminRoute'
import ProtectedRoute from './ProtectedRoute'
import PublicOnlyRoute from './PublicOnlyRoute'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const SignupPage = lazy(() => import('@/pages/SignupPage'))
const ForgotPasswordPage = lazy(() => import('@/pages/ForgotPasswordPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const TripsPage = lazy(() => import('@/pages/TripsPage'))
const NewTripPage = lazy(() => import('@/pages/NewTripPage'))
const EditTripPage = lazy(() => import('@/pages/EditTripPage'))
const TripBuilderPage = lazy(() => import('@/pages/TripBuilderPage'))
const ItineraryViewPage = lazy(() => import('@/pages/ItineraryViewPage'))
const CalendarPage = lazy(() => import('@/pages/CalendarPage'))
const BudgetPage = lazy(() => import('@/pages/BudgetPage'))
const DiscoverPage = lazy(() => import('@/pages/DiscoverPage'))
const DiscoverCitiesPage = lazy(() => import('@/pages/DiscoverCitiesPage'))
const CityDetailPage = lazy(() => import('@/pages/CityDetailPage'))
const DiscoverTripsPage = lazy(() => import('@/pages/DiscoverTripsPage'))
const SharedTripPage = lazy(() => import('@/pages/SharedTripPage'))
const ProfilePage = lazy(() => import('@/pages/ProfilePage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'))
const AdminUsersPage = lazy(() => import('@/pages/AdminUsersPage'))

function RouteFallback() {
  return (
    <div className="flex min-h-48 items-center justify-center">
      <Spinner />
    </div>
  )
}

export default function AppRoutes() {
  return (
    <Suspense fallback={<RouteFallback />}>
      <Routes>
        <Route element={<AuthLayout />}>
          <Route element={<PublicOnlyRoute />}>
            <Route path={ROUTES.login} element={<LoginPage />} />
            <Route path={ROUTES.signup} element={<SignupPage />} />
            <Route path={ROUTES.forgotPassword} element={<ForgotPasswordPage />} />
          </Route>
        </Route>

        <Route element={<AppLayout />}>
          <Route path={ROUTES.discover} element={<DiscoverPage />} />
          <Route path={ROUTES.discoverCities} element={<DiscoverCitiesPage />} />
          <Route path="/discover/cities/:cityId" element={<CityDetailPage />} />
          <Route path={ROUTES.discoverTrips} element={<DiscoverTripsPage />} />

          <Route element={<ProtectedRoute />}>
            <Route path={ROUTES.dashboard} element={<DashboardPage />} />
            <Route path={ROUTES.trips} element={<TripsPage />} />
            <Route path={ROUTES.tripNew} element={<NewTripPage />} />
            <Route path="/trips/:tripId" element={<TripBuilderPage />} />
            <Route path="/trips/:tripId/edit" element={<EditTripPage />} />
            <Route path="/trips/:tripId/itinerary" element={<ItineraryViewPage />} />
            <Route path="/trips/:tripId/calendar" element={<CalendarPage />} />
            <Route path="/trips/:tripId/budget" element={<BudgetPage />} />
            <Route path={ROUTES.profile} element={<ProfilePage />} />
            <Route path={ROUTES.settings} element={<SettingsPage />} />
          </Route>

          <Route element={<AdminRoute />}>
            <Route path={ROUTES.admin} element={<Navigate to={ROUTES.adminDashboard} replace />} />
            <Route path={ROUTES.adminDashboard} element={<AdminDashboardPage />} />
            <Route path={ROUTES.adminUsers} element={<AdminUsersPage />} />
          </Route>
        </Route>

        <Route element={<PublicShell />}>
          <Route path="/shared/:tripId" element={<SharedTripPage />} />
        </Route>

        <Route path="/" element={<Navigate to={ROUTES.dashboard} replace />} />
        <Route path="*" element={<Navigate to={ROUTES.dashboard} replace />} />
      </Routes>
    </Suspense>
  )
}
