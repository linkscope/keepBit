<template>
  <div class="bg-gray-100 text-gray-800">

    <!-- 页头 -->
    <header class="bg-white-600 text-black py-6">
      <div class="container mx-auto text-center">
        <h1 class="text-4xl font-bold">代理商等级标准说明</h1>
      </div>
    </header>

    <!-- 协议正文 -->
    <main class="py-16 px-4 sm:px-6 lg:px-12">
      <div class="container mx-auto bg-white p-8 rounded-lg shadow-lg">

        <!-- 代理商返佣规则 -->
        <section class="mb-12">
          <p class="mt-4 text-lg text-gray-700">
            代理商返佣规则 （备注：每个代理商的考核标准为20000以上，没有达到标准的只能获得其所邀请好友交易手续费的10%）
          </p>
          <p class="mt-4 text-lg text-gray-700">
            通过您的专享邀请链接或邀请码邀请好友加入KeepBit，充值金额≥1000U即可享受其交易手续费10%的返佣奖励，当所邀请的好友资产总额达到20000U以上，即可升级为代理人，享受手续费10%+对应代理等级策略盈利分润提成。
          </p>
          <!-- 插入图片 -->
          <div class="mt-8">
            <img src="/agencyPlanImag1.png" alt="ima" class="w-full h-auto mb-8">
          </div>
          <h2 class="mt-4 text-xl font-bold">1级：1000--19999，手续费提成10%</h2>
          <h2 class="mt-4 text-xl font-bold">2级: ≥20000    手续费10%，分润提成15%</h2>
          <h2 class="mt-4 text-xl font-bold">3级: ≥100000    手续费10%，分润提成 20%</h2>
          <h2 class="mt-4 text-xl font-bold">4级: ≥500000    手续费10%，分润提成 25%</h2>
          <h2 class="mt-4 text-xl font-bold">5级（初级合伙人）: ≥1000000  手续费15%，分润提成 35%</h2>
          <h2 class="mt-4 text-xl font-bold">6级（中级合伙人）: ≥2000000  手续费20%，分润提成 40%</h2>
          <h2 class="mt-4 text-xl font-bold">7级（高级合伙人）: ≥3000000  手续费25%，分润提成 45%</h2>

          <p class="mt-4 text-lg text-gray-700">
            手续费计算方式：当好友交易产生100USDT的手续费时，您将获得10USDT（100 * 10%）的返佣
          </p>
          <p class="mt-4 text-lg text-gray-700">
            分润提成计算方式：代理线上好友策略盈利（已结束策略）按对应账户VIP等级比例分润，分润总额×代理等级分润比例=分润提成
          </p>
          <p class="mt-4 text-lg text-gray-700">
            子代理提成：自代线上直属客户邀请好友加入KeepBit，其好友总资产纳入自代线等级考评，当其好友总资产≥20000自动升级为子代理，可享受子代理线上直属客户分润总额5%的分润提成，子代理按等级享有正常手续费返佣+分润提成。
          </p>
          <p class="mt-4 text-lg text-gray-700">
            代理及合伙人等级考评：自代线上直属客户资产总额+ 子代理线上直属客户资产总额=代理等级及合伙人等级（注：手续费返佣及分润提成只限于代理线上直属客户+ 子代理线上直属客户分润总额5%）。
          </p>
          <h2 class="mt-4 text-xl font-bold">备注：</h2>
          <p class="mt-4 text-lg text-gray-700">
            全民代理的模式，任何人都可以成为代理商，公司对于每个代理商都是公平公正的，每个人的机遇和待遇都是一样的，系统根据资产总额每日定时对账户VIP等级 代理线等级进行考评，并自动核算当天的手续费提成和分润提成。
          </p>

          <h2 class="mt-4 text-xl font-bold">代理商提成及等级考评示例：</h2>
          <!-- 插入图片 -->
          <div class="mt-8">
            <img src="/agencyPlanImag2.png" alt="ima" class="w-full h-auto mb-8">
          </div>
          <h3 class="mt-4 text-lg text-gray-700">代理商A等级考评：</h3>
          <p class="mt-4 text-lg text-gray-700">
            直属客户（A-01～A-05）资产总额60000U+子代理A-05直属客户（B-06～B-09）资产总额40000U=100000U = 3级代理
          </p>
          <h3 class="mt-4 text-lg text-gray-700">代理商A提成：</h3>
          <p class="mt-4 text-lg text-gray-700">
            直属客户（A-01～A-05）  手续费10%+分润提成20%<br>
            子代理A-05 直属客户（B-06～B-09） 分润提成5%
          </p>

          <h3 class="mt-4 text-lg text-gray-700">代理A-05等级考评：</h3>
          <p class="mt-4 text-lg text-gray-700">
            直属客户（B-06～B-09）资产总额40000U+子代理B-09 直属客户（C-10～C-12）资产总额15000U=55000U = 2级代理
          </p>
          <h3 class="mt-4 text-lg text-gray-700">代理A-05提成：</h3>
          <p class="mt-4 text-lg text-gray-700">
            直属客户（B-06～B-09）  手续费10%+分润提成15%
          </p>

          <h3 class="mt-4 text-lg text-gray-700">子代理B-09 等级考评：</h3>
          <p class="mt-4 text-lg text-gray-700">
            直属客户（C-10～C-12）资产总额15000U= 1级代理
          </p>
          <h3 class="mt-4 text-lg text-gray-700">子代理B-09 提成：</h3>
          <p class="mt-4 text-lg text-gray-700">
            直属客户（C-10～C-12）  手续费10%
          </p>

          <h2 class="mt-4 text-xl font-bold">代理商管理系统：</h2>
          <p class="mt-4 text-lg text-gray-700">
            <a href="https://agent.keepbit.top/login?redirect=/index" class="text-blue-500">https://agent.keepbit.top/login?redirect=/index</a>
          </p>
          <p class="mt-4 text-lg text-gray-700">
            每个代理商都可以使用本人的邮箱和密码登录查看明细，后续将会并入APP内置，让所有人可以对每一天的努力，都一目了然。
          </p>

          <h2 class="mt-4 text-xl font-bold">机遇！掌握的角度助你攀登高峰！</h2>
          <h2 class="mt-4 text-xl font-bold">拼搏！努力的成果永远属于自己！</h2>

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
