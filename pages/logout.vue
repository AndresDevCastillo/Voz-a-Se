<script setup>
const router = useRouter();
const user = useUserStore();
user.logout();
router.push("/admin/salas");
</script>
