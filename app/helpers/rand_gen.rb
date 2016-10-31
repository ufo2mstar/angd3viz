require 'require_all'
require_all 'rand_utils/*.rb'
require 'json'

RandSeed.germinate 1234

clients = 5
accounts = 10
positions = 7
facilities = 3
obligations = 10

module RandAM
  extend self
  include MatchMaker

  def create name, num, n_dig = 10, alpha_numeric_flag = false
    # num.times.map { "#{name}-#{rand(num).to_s.rjust(n_dig, '0')}" }
    num.times.map {
      rnd_num = alpha_numeric_flag ? RandomString.alpha_num_gen(n_dig) : RandomString.num_gen(n_dig)
      "#{name}-#{(rnd_num)}"
    }
  end

  def combine src, dest
    res = []
    pair = serial_pair src, dest
    num = 10
    pair.each { |link|
      node = {}
      node['source'] = link[0]
      node['target'] = link[1]
      node['value'] = (1..10).to_a.sample.to_s
      res << node
    }
    res
  end
end


c = RandAM.create "ECI", clients, 10
a = RandAM.create "ACC", accounts, 8
p = RandAM.create "pos", positions, 8, 'alpha'
f = RandAM.create "Fac", facilities, 10
o = RandAM.create "obg", obligations, 8, 'alpha'

# nodes = []
nodes = c + a + p + f + o
nodes.map! { |name| {'name' => name} }

links = []
links << RandAM.combine(c, a)
links << RandAM.combine(a, p)
links << RandAM.combine(p, f)
links << RandAM.combine(f, o)

out = {}
out['links'] = links.flatten
out['nodes'] = nodes

puts out.to_json
File.open('C:\Users\kyu-homebase\repos\angd3viz\try\json\sankeygreenhouse.json', 'w') { |f| f.write(out.to_json) }
