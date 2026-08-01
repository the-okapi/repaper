# Repaper

## Error Codes

| Method         | File                                                        | Codes    |
| -------------- | ----------------------------------------------------------- | -------- |
| `getStudents`  | `src/routes/organization/[org]/class/[id]/server.remote.ts` | 1, 6     |
| `add`          | `src/routes/organization/[org]/class/[id]/actions.ts`       | 2 → 5, 9 |
| `remove`       | same                                                        | 7, 8     |
| `load`         | `src/routes/organization/[org]/class/[id]/+page.server.ts`  | 31, 32   |
| `load`         | `src/routes/organization/[org]/class/[id]/load.remote.ts`   | 34, 35   |
| `load`         | `src/routes/+layout.server.ts`                              | 37, 38   |
| `rename`       | `src/routes/organization/[org]/actions.ts`                  | 40, 41   |
| `create`       | same                                                        | 43 → 45  |
| `revoke`       | same                                                        | 47, 48   |
| `renameMember` | same                                                        | 50 → 52  |
| `deleteMember` | same                                                        | 54 → 56  |
| `restore`      | same                                                        | 58 → 60  |
| `promote`      | same                                                        | 62, 63   |
| `demote`       | same                                                        | 65, 66   |
| `load`         | `src/routes/organization/[org]/+page.server.ts`             | 68 → 71  |
| `load`         | `src/routes/invitation/[org]/[id]/+page.server.ts`          | 72       |
| `default`      | same                                                        | 73 → 75  |
| `load`         | `src/routes/home/load.remote.ts`                            | 76, 77   |
| `create`       | `src/routes/home/+page.server.ts`                           | 79, 80   |
| `organization` | same                                                        | 82, 83   |
| `signOut`      | `src/lib/actions.remote.ts`                                 | 84       |
| `logIn`        | same                                                        | 85, 86   |
