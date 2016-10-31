module DebugMate
# TIMING (to help Profiling)
# Thanks MatLab! :)

  def tic arg="default_dude"
    $tic      = {} unless $tic
    tic       =Time.now
    $tic["default_dude"] = tic
    $tic[arg] = tic
  end

  def toc arg="default_dude",print_text = nil
    toc            =Time.now
    respective_tic = $tic[arg] || (p("no tic '#{arg}' was instantiated.. using last tic['default_dude']", :r); $tic["default_dude"])
    diff           = toc- respective_tic
    p "#{diff}s - #{print_text}" if print_text and defined? profiling_mode and profiling_mode
    diff
  end

end

include DebugMate

if $0 == __FILE__
  require_relative 'cosmetics'
  ENV['color'] = "kod"
  p tic
  p toc
  sleep 1
  p tic "a"
  p toc "a"
  sleep 1
  p toc "b"
  p toc "default_dude"
end