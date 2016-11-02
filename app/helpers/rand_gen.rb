require 'require_all'
require_all 'rand_utils/*.rb'
require 'json'
require 'csv'
ENV["color"] = 'true'

seed_id = 123457
rnd =-> n { (1..n).to_a.sample }
clients, accounts, positions, facilities, obligations = [rnd[5], rnd[10], rnd[10], rnd[5], rnd[10]]

clients ||= 3
accounts ||= 7
positions ||= 7
facilities ||= 2
obligations ||= 6
RandSeed.germinate seed_id

filename = "fac_#{seed_id}_#{clients}-#{accounts}-#{positions}-#{facilities}-#{obligations}"
p "Generating #{filename} ->", :bl

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

# csv make
csv_title = out['links'].first.keys.to_csv
csv_rows = ""
out['links'].each { |row_hsh| csv_rows << row_hsh.values.to_csv }
csv_out = csv_title+csv_rows

puts out.to_json
puts csv_out

loc = File.dirname(__FILE__)+"/../../"
p "Generated ->", :g
File.open(loc+"try/json/#{filename}.js", 'w') { |f| f.write(out.to_json); p "#{filename}.js", :y }
File.open(loc+"try/csv/#{filename}.csv", 'w') { |f| f.write(csv_out); p "#{filename}.csv", :g }

