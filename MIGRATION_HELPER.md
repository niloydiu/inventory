/**
 * Migration Helper
 * Quick reference for migrating from old API to new API client pattern
 */

// ============================================
// IMPORT PATTERN
// ============================================

// Always import these:
import apiClient from "@/lib/api-client"
import { ITEMS_ENDPOINTS, ASSIGNMENTS_ENDPOINTS, etc. } from "@/lib/config/api-endpoints"

// ============================================
// ITEMS
// ============================================

// OLD:
import { itemsApi } from "@/lib/api";
const items = await itemsApi.getAll(token);
const item = await itemsApi.getById(id, token);
await itemsApi.create(data, token);
await itemsApi.update(id, data, token);
await itemsApi.delete(id, token);

// NEW:
import apiClient from "@/lib/api-client"
import { ITEMS_ENDPOINTS } from "@/lib/config/api-endpoints"
const items = await apiClient.get(ITEMS_ENDPOINTS.BASE, {}, token);
const item = await apiClient.get(ITEMS_ENDPOINTS.BY_ID(id), {}, token);
await apiClient.post(ITEMS_ENDPOINTS.BASE, data, token);
await apiClient.put(ITEMS_ENDPOINTS.BY_ID(id), data, token);
await apiClient.delete(ITEMS_ENDPOINTS.BY_ID(id), token);

// ============================================
// ASSIGNMENTS
// ============================================

// OLD:
import { assignmentsApi } from "@/lib/api";
const assignments = await assignmentsApi.getAll(token);
await assignmentsApi.create(data, token);
await assignmentsApi.return(id, data, token);

// NEW:
import apiClient from "@/lib/api-client"
import { ASSIGNMENTS_ENDPOINTS } from "@/lib/config/api-endpoints"
const assignments = await apiClient.get(ASSIGNMENTS_ENDPOINTS.BASE, {}, token);
await apiClient.post(ASSIGNMENTS_ENDPOINTS.BASE, data, token);
await apiClient.patch(ASSIGNMENTS_ENDPOINTS.RETURN(id), data, token);

// ============================================
// LIVESTOCK
// ============================================

// OLD:
import { livestockApi } from "@/lib/api";
const livestock = await livestockApi.getAll(token);
await livestockApi.create(data, token);

// NEW:
import apiClient from "@/lib/api-client"
import { LIVESTOCK_ENDPOINTS } from "@/lib/config/api-endpoints"
const livestock = await apiClient.get(LIVESTOCK_ENDPOINTS.BASE, {}, token);
await apiClient.post(LIVESTOCK_ENDPOINTS.BASE, data, token);

// ============================================
// FEEDS
// ============================================

// OLD:
import { feedsApi } from "@/lib/api";
const feeds = await feedsApi.getAll(token);

// NEW:
import apiClient from "@/lib/api-client"
import { FEEDS_ENDPOINTS } from "@/lib/config/api-endpoints"
const feeds = await apiClient.get(FEEDS_ENDPOINTS.BASE, {}, token);

// ============================================
// DASHBOARD
// ============================================

// OLD:
import { dashboardApi } from "@/lib/api";
const stats = await dashboardApi.getStats(token);

// NEW:
import apiClient from "@/lib/api-client"
import { DASHBOARD_ENDPOINTS } from "@/lib/config/api-endpoints"
const stats = await apiClient.get(DASHBOARD_ENDPOINTS.STATS, {}, token);

// ============================================
// TYPICAL COMPONENT MIGRATION
// ============================================

// OLD PATTERN:
export default function MyPage() {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await itemsApi.getAll(token);
        setData(result);
      } catch (error) {
        toast.error("Failed to load");
      }
    }
    fetchData();
  }, [token]);
  
  return <div>{/* render */}</div>;
}

// NEW PATTERN:
import apiClient from "@/lib/api-client"
import { ITEMS_ENDPOINTS } from "@/lib/config/api-endpoints"

// 1. Create content component
export function MyContent() {
  const { token } = useAuth();
  const [data, setData] = useState([]);
  
  useEffect(() => {
    async function fetchData() {
      try {
        const result = await apiClient.get(ITEMS_ENDPOINTS.BASE, {}, token);
        setData(result);
      } catch (error) {
        toast.error("Failed to load");
      }
    }
    fetchData();
  }, [token]);
  
  return <div>{/* render */}</div>;
}

// 2. Update page to be minimal
export default function MyPage() {
  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <MyContent />
    </div>
  );
}

// ============================================
// ERROR HANDLING
// ============================================

// API client throws errors on failure, so use try/catch:
try {
  const data = await apiClient.get(ITEMS_ENDPOINTS.BASE, {}, token);
  // Success - use data directly
} catch (error) {
  // Error - handle error.message
  toast.error(error.message);
}
