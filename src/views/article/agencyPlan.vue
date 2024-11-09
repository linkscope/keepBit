<template>
  <div class="bg-gray-100 text-gray-800">

    <!-- 页头 -->
    <header class="bg-white-600 text-black py-6">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold">{{ t('agencyPlan.title') }}</h1>
      </div>
    </header>

    <!-- 协议正文 -->
    <main class="py-16 px-4 sm:px-6 lg:px-12">
      <div class="container mx-auto bg-white p-8 rounded-lg shadow-lg">

        <!-- 代理商返佣规则 -->
        <section class="mb-12">
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.commissionRule') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.inviteRule') }}
          </p>

          <!-- 插入图片 -->
          <div class="mt-8">
            <img src="/agencyPlanImag1.png" alt="ima" class="w-full h-auto mb-8">
          </div>

          <h2 class="mt-4 text-xl font-bold">{{ t('agencyPlan.level1') }}</h2>
          <h2 class="mt-4 text-xl font-bold">{{ t('agencyPlan.level2') }}</h2>
          <h2 class="mt-4 text-xl font-bold">{{ t('agencyPlan.level3') }}</h2>
          <h2 class="mt-4 text-xl font-bold">{{ t('agencyPlan.level4') }}</h2>
          <h2 class="mt-4 text-xl font-bold">{{ t('agencyPlan.level5') }}</h2>
          <h2 class="mt-4 text-xl font-bold">{{ t('agencyPlan.level6') }}</h2>
          <h2 class="mt-4 text-xl font-bold">{{ t('agencyPlan.level7') }}</h2>

          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.commissionCalculation') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.profitSharingCalculation') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.subAgentCommission') }}
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.agentLevelAssessment') }}
          </p>
          <h2 class="mt-4 text-xl font-bold">{{ t('agencyPlan.notes') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.notesContent') }}
          </p>

          <h2 class="mt-4 text-xl font-bold">{{ t('agencyPlan.agentExampleTitle') }}</h2>

          <!-- 插入图片 -->
          <div class="mt-8">
            <img src="/agencyPlanImag2.png" alt="ima" class="w-full h-auto mb-8">
          </div>

          <h3 class="mt-4 text-lg text-gray-700">{{ t('agencyPlan.agentAAssessment') }}</h3>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.agentADetails') }}
          </p>
          <h3 class="mt-4 text-lg text-gray-700">{{ t('agencyPlan.agentACommission') }}</h3>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.agentACommissionDetails') }}
          </p>

          <h3 class="mt-4 text-lg text-gray-700">{{ t('agencyPlan.agentA05Assessment') }}</h3>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.agentA05Details') }}
          </p>

          <h3 class="mt-4 text-lg text-gray-700">{{ t('agencyPlan.agentA05Commission') }}</h3>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.agentA05CommissionDetails') }}
          </p>

          <h3 class="mt-4 text-lg text-gray-700">{{ t('agencyPlan.subAgentB09Assessment') }}</h3>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.subAgentB09Details') }}
          </p>

          <h3 class="mt-4 text-lg text-gray-700">{{ t('agencyPlan.subAgentB09Commission') }}</h3>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.subAgentB09CommissionDetails') }}
          </p>

          <h2 class="mt-4 text-xl font-bold">{{ t('agencyPlan.agentSystemTitle') }}</h2>
          <p class="mt-4 text-lg text-gray-700">
            <a href="https://agent.keepbit.top/login?redirect=/index" class="text-blue-500">{{ t('agencyPlan.agentSystemLink') }}</a>
          </p>
          <p class="mt-4 text-lg text-gray-700">
            {{ t('agencyPlan.agentSystemDetails') }}
          </p>

          <h2 class="mt-4 text-xl font-bold">{{ t('agencyPlan.opportunityTitle') }}</h2>
          <h2 class="mt-4 text-xl font-bold">{{ t('agencyPlan.striveTitle') }}</h2>

        </section>

      </div>
    </main>
  </div>
</template>

<script setup>
</script>

<style scoped>
/* 可以在这里添加额外的自定义样式 */
</style>
