<template>
  <q-page-container>
    <q-page p-4>
      <div
        flex
        gap-2
      >
        <q-input
          v-model="searchValue"
          :debounce="200"
          :placeholder="t('Search users')"
          dense
        >
          <template #append>
            <q-btn-dropdown
              flat
              dense
              :label="searchField"
            >
              <q-list>
                <menu-item
                  label="Email"
                  @click="searchField = 'email'"
                />
                <menu-item
                  label="Name"
                  @click="searchField = 'name'"
                />
              </q-list>
            </q-btn-dropdown>
          </template>
        </q-input>
        <q-btn
          icon="sym_o_add"
          :label="t('Create User')"
          @click="createUser"
          unelevated
          bg-pri-c
          text-on-pri-c
          no-caps
          ml-a
          shrink-0
        />
      </div>
      <q-table
        class="users-table"
        ref="tableRef"
        :rows
        :columns
        row-key="id"
        v-model:pagination="pagination"
        :loading
        binary-state-sort
        @request="onRequest"
        :rows-per-page-options="[10, 20, 50, 100]"
        flat
        bg-sur-c-low
        mt-4
      >
        <template #body-cell-actions="props">
          <q-td
            :props
            text-on-sur-var
          >
            <q-btn
              icon="sym_o_edit"
              :title="t('Edit Info')"
              flat
              round
              size="sm"
              @click="editUser(props.row)"
            />
            <q-btn
              icon="sym_o_more_vert"
              :title="t('Actions')"
              flat
              round
              size="sm"
            >
              <q-menu>
                <q-list>
                  <menu-item
                    :label="t('View Workspaces')"
                    :to="`/workspaces?ownerId=${props.row.id}`"
                  />
                  <menu-item
                    :label="t('Reset Password')"
                    @click="resetPassword(props.row)"
                  />
                  <menu-item
                    :label="t('Revoke Sessions')"
                    @click="revokeSessions(props.row)"
                  />
                  <menu-item
                    :label="t('Ban User')"
                    @click="banUser(props.row)"
                  />
                  <menu-item
                    :label="t('Delete User')"
                    @click="deleteUser(props.row)"
                    hover:text-err
                  />
                </q-list>
              </q-menu>
            </q-btn>
          </q-td>
        </template>
      </q-table>
    </q-page>
  </q-page-container>
</template>

<script setup lang="ts">
import type { UserWithRole } from 'better-auth/plugins'
import type { QTableColumn, QTableProps } from 'quasar'
import { useQuasar } from 'quasar'
import { authClient } from 'src/utils/auth-client'
import { t } from 'src/utils/i18n'
import { onMounted, ref, watch } from 'vue'
import UpdateUserDialog from '../components/UpdateUserDialog.vue'
import MenuItem from 'src/components/MenuItem.vue'
import BanUserDialog from '../components/BanUserDialog.vue'
import CreateUserDialog from '../components/CreateUserDialog.vue'

function formatDate(date?: Date) {
  return date ? date.toLocaleString() : ''
}

const columns: QTableColumn[] = [
  { name: 'id', label: t('ID'), field: 'id', sortable: true, align: 'left' },
  { name: 'name', label: t('Name'), field: 'name', sortable: true },
  { name: 'email', label: t('Email'), field: 'email', sortable: true },
  { name: 'emailVerified', label: t('Email Verified'), field: 'emailVerified', sortable: true },
  { name: 'createdAt', label: t('Created At'), field: 'createdAt', format: formatDate, sortable: true },
  { name: 'updatedAt', label: t('Updated At'), field: 'updatedAt', format: formatDate, sortable: true },
  { name: 'role', label: t('Role'), field: 'role', sortable: true },
  { name: 'banReason', label: t('Ban Reason'), field: 'banReason', sortable: true },
  { name: 'banExpires', label: t('Ban Expires'), field: 'banExpires', format: formatDate, sortable: true },
  { name: 'actions', label: t('Actions'), field: () => null },
]

const rows = ref<UserWithRole[]>([])
const searchValue = ref('')
const searchField = ref<('email' | 'name')>('email')
const loading = ref(false)
const pagination = ref<QTableProps['pagination']>({
  sortBy: 'createdAt',
  descending: true,
  page: 1,
  rowsPerPage: 20,
})

const $q = useQuasar()
const onRequest: QTableProps['onRequest'] = async ({
  pagination: { sortBy, descending, page, rowsPerPage },
}) => {
  loading.value = true
  const { data, error } = await authClient.admin.listUsers({
    query: {
      searchValue: searchValue.value ?? undefined,
      searchField: searchField.value,
      searchOperator: 'contains',
      sortBy,
      sortDirection: descending ? 'desc' : 'asc',
      limit: rowsPerPage,
      offset: (page - 1) * rowsPerPage,
    },
  })
  loading.value = false
  if (error) {
    console.error(error)
    $q.notify({
      message: t('Failed to fetch users: {0}', error.message),
      color: 'negative',
    })
    return
  }
  pagination.value = {
    sortBy,
    descending,
    page,
    rowsPerPage,
    rowsNumber: data.total,
  }
  rows.value = data.users
}

const tableRef = ref()
const refresh = () => tableRef.value?.requestServerInteraction()
onMounted(refresh)
watch([searchValue, searchField], refresh)

function createUser() {
  $q.dialog({
    component: CreateUserDialog,
  }).onOk(refresh)
}
function editUser(user: UserWithRole) {
  $q.dialog({
    component: UpdateUserDialog,
    componentProps: {
      user,
    },
  }).onOk(refresh)
}
function resetPassword({ id, name }: UserWithRole) {
  $q.dialog({
    title: t('Reset Password'),
    message: t('Set new password for user "{0}":', name),
    prompt: {
      model: '',
      type: 'password',
    },
    cancel: true,
  }).onOk(newPassword => {
    authClient.admin.setUserPassword({
      userId: id,
      newPassword,
    }).catch(err => {
      console.error(err)
      $q.notify({
        message: t('Failed to reset password: {0}', err.message),
        color: 'negative',
      })
    })
  })
}
function revokeSessions({ id, name }: UserWithRole) {
  $q.dialog({
    title: t('Revoke Sessions'),
    message: t('Are you sure you want to revoke all sessions for "{0}"?', name),
    cancel: true,
    ok: t('Revoke'),
  }).onOk(() => {
    authClient.admin.revokeUserSessions({ userId: id }).catch(err => {
      console.error(err)
      $q.notify({
        message: t('Failed to revoke sessions: {0}', err.message),
        color: 'negative',
      })
    })
  })
}
function banUser(user: UserWithRole) {
  $q.dialog({
    component: BanUserDialog,
    componentProps: {
      user,
    },
  }).onOk(refresh)
}
function deleteUser({ id, name }: UserWithRole) {
  $q.dialog({
    title: t('Delete User'),
    message: t('Are you sure you want to delete user "{0}"? Note that you must delete all workspaces created by this user before you can delete the user.', name),
    cancel: true,
    ok: {
      label: t('Delete'),
      color: 'negative',
      flat: true,
    },
  }).onOk(() => {
    authClient.admin.removeUser({ userId: id }).then(refresh).catch(err => {
      console.error(err)
      $q.notify({
        message: t('Failed to delete user: {0}', err.message),
        color: 'negative',
      })
    })
  })
}
</script>
<style lang="scss">
.users-table {
  th:last-child,
  td:last-child {
    --at-apply: 'pos-sticky right-0 z-1 bg-sur-c-low';
  }
}
</style>
